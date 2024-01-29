# Start all managed servers of a domain
 
import sys
from java.util import Properties
from java.io import FileInputStream
from java.io import File
 
domainProps = Properties();
userConfigFile = '';
userKeyFile = '';
 
# Load properties
def intialize():
        global domainProps;
        global userConfigFile;
        global userKeyFile;
 
        # test arguments
        if len(sys.argv) != 3:
                print 'Usage:  startAllManagedServers.py  <property_file>';
                exit();
 
        try:
                domainProps = Properties()
 
                # load properties and overwrite defaults
                input = FileInputStream(sys.argv[1])
                domainProps.load(input)
                input.close()
 
                userConfigFile = sys.argv[2]
                userKeyFile =  sys.argv[3]
        except:
                print 'Cannot load properties  !';
                exit();
 
        print 'Initialization completed';
 
See the book code download for full script
 
# Connect to adminserver - wait max. 10 minutes for connection
def connnectToAdminServer():
 
         connUri = domainProps.getProperty('adminURL')
 
         currentcount = 0;
         adminServerIsRunning = 'false';
 
         while ((adminServerIsRunning=='false')  and (currentcount<30)):
               try:
                        print 'Connecting to the Admin Server ('+connUri+')';
                        connect(userConfigFile=userConfigFile,userKeyFile=userKeyFile,url=connUri);
                        print 'Connected';
                        adminServerIsRunning = 'true';
               except:
                        print 'AdminServer is (not yet) running. Will wait for 10sec.';
                        java.lang.Thread.sleep(10000);
                        currentcount = currentcount +1;
 
         if (adminServerIsRunning=='false'):
                print 'Could not connect to admin server - script will be exit !'
                exit();
 
 
# get Server status
def getMSserverStatus(server):
        try:
             cd('/ServerLifeCycleRuntimes/' +server)
        except:
             print 'oh ohohohoh';
             dumpStack();
        return cmo.getState()
 
 
# Start all managed server
def startAllManagedServers():
    try:
                print 'Loop through the managed servers and start all servers ';
                domainConfig()
                svrs = cmo.getServers()
 
                domainRuntime()
                for server in svrs:
                        # Do not start the adminserver, it's already running
                        if server.getName() != 'AdminServer':
                                # Get state and machine
                                serverState = getMSserverStatus(server.getName())
                                print server.getName() + " is " + serverState
                                # startup if needed
                                if (serverState == "SHUTDOWN") or
                                   (serverState == "FAILED_NOT_RESTARTABLE"):
                                           print "Starting " + server.getName();
                                           start(server.getName(),'Server')
                                           serverState = getMSserverStatus(server.getName())
                                           print "Now " + server.getName() + " is " + serverState;
    except:
        print 'Exception while starting managed servers !';
        dumpStack();
 
 
# disconnect from  adminserver
def disconnectFromAdminserver():
        print 'Disconnect from the Admin Server...';
        disconnect();
 
 
# ================================================================
#           Main Code Execution
# ================================================================
if __name__== "main":
        print ' Start all managed server of the domain \n';
        intialize();
        connnectToAdminServer();
        startAllManagedServers();
        disconnectFromAdminserver();
