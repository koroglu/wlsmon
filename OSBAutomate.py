from java.io import FileInputStream
from java.io import FileOutputStream
from java.util import ArrayList
from java.util import Collections
from java.util import HashSet, HashMap
from com.bea.wli.sb.util import EnvValueTypes
from com.bea.wli.sb.util import Refs
from com.bea.wli.config.env import EnvValueQuery
from com.bea.wli.config.env import QualifiedEnvValue
from com.bea.wli.config import Ref
from com.bea.wli.config.customization import Customization
from com.bea.wli.config.customization import FindAndReplaceCustomization
from com.bea.wli.config.customization import EnvValueCustomization
from com.bea.wli.sb.management.configuration import SessionManagementMBean
from com.bea.wli.sb.management.configuration import ALSBConfigurationMBean
from com.bea.wli.sb.management.importexport import ALSBImportOperation

import sys
import getopt
import os
import datetime
import zipfile
import time

if __name__== "main":
  print 'done'
  print '==============' + sys.argv[1]
  if sys.argv[1] == 'deploy':
      importOSBProject(envProps,'sanane',artifact)

  if sys.argv[1] == 'undeploy':
      connect('weblogic','pass','t3://')
      domainRuntime()
      deleteProjectFromOSB(sys.argv[2])

def createSessionName():
    sessionName = "OSBDEPLOYER_IMPORT" + str(System.currentTimeMillis())
    print( "CRETAED " + sessionName)
    return sessionName

def getALSBConfigurationMBEAN(sessionName):
    return findService(ALSBConfigurationMBean.NAME + "." + sessionName, ALSBConfigurationMBean.TYPE)
                       
                       
def getSessionManagementMBean(sessionName):
    SessionMBean = findService(SessionManagementMBean.NAME,SessionManagementMBean.TYPE)
    SessionMBean.createSession(sessionName)
    return SessionMBean

def discardSession(sessionManagementMBean, sessionName):
     if sessionManagementMBean != None:
          if sessionManagementMBean.sessionExists(sessionName):
               sessionManagementMBean.discardSession(sessionName)
               print (sessionName + " - SESSION DISCARDED...")    

def readBinaryFile(fileName):
    file = open(fileName, 'rb')
    bytes = file.read()
    return bytes




def importOSBProject(envProps,projectName,artifact):
    
    connectAdmin(envProps)
    domainRuntime()
    sessionName = None
    try:
        sessionName = createSessionName()
        SessionMBean = getSessionManagementMBean(sessionName)
        configurationMBean = getALSBConfigurationMBEAN(sessionName)
        print ("DELETE PROJECT FIRST: " + projectName)
        print ("DELETING PROJECT :" + projectName )
        
        ''' Step - 2 - Delete existing project '''
        
        undeployProjectFromOSBDomain(projectName)
        print("ARTIFACT IMPORT STARTS ....")
        print ("JAR FILE: " + os.getcwd()+"/artifacts/"+artifact) # I have artifact dir where my sbconfig.sbar is stored
        bytes = readBinaryFile(os.getcwd()+"/artifacts/"+artifact)
        configurationMBean.uploadJarFile(bytes)
        alsbJarInfo = configurationMBean.getImportJarInfo()
        alsbImportPlan = alsbJarInfo.getDefaultImportPlan()
        alsbImportPlan.setPassphrase(None)
        alsbImportPlan.setPreserveExistingEnvValues(false)
        refMap = HashMap()
        for r in alsbJarInfo.getResourceInfos().entrySet():
            projectRef = r.getValue().getRef()
            refMap.put(projectRef.getProjectName(), projectRef)
        print("IMPORTING JAR  " +  artifact + "..PLEASE WAIT..THIS CAN TAKE TIME..")
        result=configurationMBean.importUploaded(alsbImportPlan)
        if result.getImported().size() > 0:
          print("IMPORT SUCCESSFUL...")
        print("ACTIVATING SESSION...PLEASE WAIT..")
        try:
            SessionMBean.activateSession(sessionName, "IMPORTED BY osbDeployer PROJECT NAME: " + projectName )
            print("SESSION ACTIVATED..")
        except:
            print ("\033[92mERROR WHILE ACTIVATING IMPORT SESSION:"+ sys.exc_info()[0] +"\033[00m")
            discardSession(SessionMBean, sessionName)
            raise
            sys.exit(2)
        print("###############################################################################")
        print("\033[92mOSB ARTIFACT/JAR :   " + projectName + "  HAS BEEN IMPORTED SUCCESSFULLY....\033[00m")
        print("###############################################################################")
    
    except:
        print("\033[91mARTIFACT :   " + projectName + "  IMPORT FAILED....\033[00m")
        sys.exit(2)

def deleteProjectFromOSB(projectName):
     try:
          sessionName  = "UndeployProjectStateSession_" + str(System.currentTimeMillis())         
          sessionManagementMBean = getSessionManagementMBean(sessionName)
          alsbConfigurationMBean = findService(ALSBConfigurationMBean.NAME + "." + sessionName, ALSBConfigurationMBean.TYPE)
          failed=deleteProject(alsbConfigurationMBean, projectName,sessionManagementMBean,sessionName)
          if failed=="true":
             discardSession(sessionManagementMBean, sessionName)
          else:
             print ("ACTIVATION SESSION...THIS CAN TAKE TIME.")    
             sessionManagementMBean.activateSession(sessionName, "PROJECT: " + projectName +" REMOVED BY OSB DEPLOYER")
             print ("SESSION ACTIVATED..")    
     except:
          print ("ERROR WHILST REMOVING PROJECT:"+  sys.exc_info()[0])
          discardSession(sessionManagementMBean, sessionName)
          raise


def deleteProject(alsbConfigurationMBean, projectName,sessionManagementMBean, sessionName):
     try:
          print ("TRYING TO REMOVE " + projectName)
          projectRef = Ref(Ref.PROJECT_REF, Ref.DOMAIN, projectName)                  
          if alsbConfigurationMBean.exists(projectRef):
               print ("#### REMOVING OSB PROJECT: " + projectName)
               alsbConfigurationMBean.delete(Collections.singleton(projectRef))
               print ("#### REMOVED PROJECT: " + projectName)
               failed="false"
               return failed
          else:
               
               print ("OSB PROJECT <" + projectName + "> DOES NOT EXIST")
               failed = "true"
               return failed

     except:
          print ("ERROR WHILST REMOVING PROJECT:" + sys.exc_info()[0])
          raise

def applyCustmization(customizationFile,projectName):
    SessionMBean = None
    todaysDate=datetime.datetime.now()
    try:
        domainRuntime()
        sessionName = String("Customization"+Long(System.currentTimeMillis()).toString())
        SessionMBean = findService("SessionManagement", "com.bea.wli.sb.management.configuration.SessionManagementMBean")
        SessionMBean.createSession(sessionName)
        OSBConfigurationMBean = findService(String("ALSBConfiguration.").concat(sessionName), "com.bea.wli.sb.management.configuration.ALSBConfigurationMBean")
        print( 'LOADING CUSTOMIZATION FILE'+ customizationFile)
        iStream = FileInputStream(customizationFile)
        customizationList = Customization.fromXML(iStream)        
        OSBConfigurationMBean.customize(customizationList)
        SessionMBean.activateSession(sessionName, "CUSTMIZATION FILE: " + customizationFile+  "APPLIED BY OSB DEPLOYER ON " + str(todaysDate))
        print ('\033[92mSUCCESSFULLY COMPLETED CUSTMIZATION\033[00m')
        disconnect()
    except:
          print ("applyCustmization:" + sys.exc_info()[0])
          raise
