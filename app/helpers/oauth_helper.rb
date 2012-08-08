require 'hmac-sha1'
require 'base64'
require 'cgi'

module OauthHelper
  
  def URLEscape(text)
    return CGI.escape(text).gsub("+", "%20")
  end
  
  def URLUnescape(text)
    return CGI.unescape(text)
  end
  
  def EscapeAndJoin(elems)
    return elems.collect { |x| URLEscape(x) }.join('&')
  end
  
  def FormatUrlParams(params)
    param_fragments = []
    params.keys.sort.each { |key|
      param_fragments.push("#{key}=#{URLEscape(params[key])}")
      logger.info "#{key} : #{params[key]}"
    }
    return param_fragments.join('&')
  end
  
  def GenerateSignatureBaseString(method, request_url_base, params)
    return EscapeAndJoin([method, request_url_base, FormatUrlParams(params)])
  end
  
  def GenerateHmacSha1Signature(text, key)
    h = HMAC::SHA1.new(key)
    h.update(text)
    digest = h.digest()
    return Base64.encode64(digest)
  end
  
  def GenerateOauthSignature(base_string, consumer_secret, token_secret)
    key = EscapeAndJoin([consumer_secret, token_secret])
    return GenerateHmacSha1Signature(base_string, key)
  end
  
  def generate_request_token
      request_url = 'https://www.google.com/accounts/OAuthGetRequestToken'
      authorize_token_url = 'https://www.google.com/accounts/OAuthAuthorizeToken'
  
      params = {}
      params['oauth_consumer_key'] = 'anonymous'
      params['oauth_nonce'] = rand(2**64 - 1).to_s
      params['oauth_signature_method'] = 'HMAC-SHA1'
      params['oauth_version'] = '1.0'
      params['oauth_timestamp'] = Time.now.to_i.to_s

      app_root = root_url
      params['oauth_callback'] = "#{app_root}oauth/authenticate"
      
      params['scope'] = 'https://mail.google.com/'
      params['xoauth_displayname'] = 'Email Profiler'
  
      base_string = GenerateSignatureBaseString('GET', request_url, params)
      logger.info "base_string = #{base_string}\n"
  
      consumer_secret = 'anonymous'
      token_secret = ''
      signature = GenerateOauthSignature(base_string, consumer_secret, token_secret)
      logger.info "signature = #{signature}\n"
  
      params['oauth_signature'] = signature
      url_str = "#{request_url}?#{FormatUrlParams(params)}"
      logger.info "url = #{url_str}\n"
  
      url = URI.parse(url_str)
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true
      response = http.get(url.path + "?" + FormatUrlParams(params))
      response_body = response.read_body
      logger.info "generate_request_token: #{response_body}"
  
      token_params = {}
      response_body.split("&").each { |tok|
          tokens = tok.split("=")
          token_params[tokens[0]] = URLUnescape(tokens[1])
      }
  
      puts token_params
      authorize_url = "#{authorize_token_url}?oauth_token=#{URLEscape(token_params['oauth_token'])}"
      puts authorize_url
      return [authorize_url, token_params['oauth_token'], token_params['oauth_token_secret']]
  end
  
  def get_access_token(oauth_token, oauth_token_secret, oauth_verifier)
      params = {}
      params['oauth_consumer_key'] = 'anonymous'
      params['oauth_nonce'] = rand(2**64 - 1).to_s
      params['oauth_signature_method'] = 'HMAC-SHA1'
      params['oauth_version'] = '1.0'
      params['oauth_timestamp'] = Time.now.to_i.to_s
  
      params['oauth_token'] = oauth_token
      params['oauth_verifier'] = oauth_verifier
      
      request_url = 'https://www.google.com/accounts/OAuthGetAccessToken'
      base_string = GenerateSignatureBaseString('GET', request_url, params)
      
      consumer_secret = 'anonymous'
      signature = GenerateOauthSignature(base_string, consumer_secret, oauth_token_secret)
      params['oauth_signature'] = signature
  
      url_str = "#{request_url}?#{FormatUrlParams(params)}"
      logger.info "url = #{url_str}\n"
  
      url = URI.parse(url_str)
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true
      response = http.get(url.path + "?" + FormatUrlParams(params))
      response_body = response.read_body
      logger.info "get_access_token: #{response_body}"
  
      token_params = {}
      response_body.split("&").each { |tok|
          tokens = tok.split("=")
          token_params[tokens[0]] = URLUnescape(tokens[1])
      }
      
      return token_params
  end  
end