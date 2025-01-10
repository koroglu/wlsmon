import getopt
from java.util import *
from javax.management import *
import javax.management.Attribute

# List of managed instance names this script will control



# WLS Admin Server hostname and port
adminHostname = '192.168.56.10'
adminPort = '17001'

# Get the command, should either be 'start' or 'stop'
getcommand=sys.argv[1]
adminuser=sys.argv[2]
adminpassword=sys.argv[3]

if getcommand != 'start' and getcommand != 'stop':
  print 'usage: <start|stop> <wls admin username> <wls admin password>'
  exit()

# Connect to the WLS Admin Server
connect(adminuser, adminpassword, 't3://' + adminHostname + ':' + adminPort)

svrs = cmo.getServers()

# Go to the root of the MBean hierarchy
domainRuntime()

# Start
if getcommand == 'start':
   for s in svrs:
     print s.getName()  + "is starting..."
     # Does the server have a ServerRuntime MBean?
     # If it does then its already running and it doesn't need starting
     bean = getMBean('ServerRuntimes/' + s.getName())
     if bean:
       print 'Server ' + s.getName() + ' is ' + bean.getState()
     else:
       start(s.getName(), 'Server', block='false')
       print 'Started Server ' + s.getName()

# Stop
if getcommand == 'stop':
   for s in svrs:
    
     # Does the server have a ServerRuntime MBean?
     # If it doesn't then its already shutdown and it doesn't need stopping
     bean = getMBean('ServerRuntimes/' + s.getName())
     if bean:
       if s.getName() != 'AdminServer':
          shutdown(s.getName(), 'Server')
          print 'Stopped Server ' + s.getName()
     else:
       print 'Server ' + s.getName() + ' is not running'

disconnect()
exit()
