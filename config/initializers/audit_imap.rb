module Kernel
  @@audit_imap_log = ActiveSupport::BufferedLogger.new("log/audit_imap.log")
  def audit_imap(message)
    preamble = "\n[#{caller.first}] at #{Time.now}\nMessage: "
    @@audit_imap_log.add 0, preamble + message.inspect
  end
end