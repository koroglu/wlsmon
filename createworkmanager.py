from java.util import *
from javax.management import *
import javax.management.Attribute
print 'starting the script .... '

loadProperties('domain.properties')
connect(adminUser,adminPassword,'t3://'+adminHost+':'+adminPort)

edit()
startEdit()
cd('/SelfTuning/DMN_OSB_PREP_12.2.1.4')
cmo.createWorkManager('WM_GWS')

cd('/SelfTuning/DMN_OSB_PREP_12.2.1.4/WorkManagers/WM_GWS')
set('Targets',jarray.array([ObjectName('com.bea:Name=osbCluster,Type=Cluster')], ObjectName))

cd('/SelfTuning/DMN_OSB_PREP_12.2.1.4')
cmo.createMinThreadsConstraint('Min_GWS')

cd('/SelfTuning/DMN_OSB_PREP_12.2.1.4/MinThreadsConstraints/Min_GWS')
set('Targets',jarray.array([ObjectName('com.bea:Name=osbCluster,Type=Cluster')], ObjectName))
cmo.setCount(1)

cd('/SelfTuning/DMN_OSB_PREP_12.2.1.4/WorkManagers/WM_GWS')
cmo.setMinThreadsConstraint(getMBean('/SelfTuning/DMN_OSB_PREP_12.2.1.4/MinThreadsConstraints/Min_GWS'))

cd('/SelfTuning/DMN_OSB_PREP_12.2.1.4')
cmo.createMaxThreadsConstraint('Max_GWS')

cd('/SelfTuning/DMN_OSB_PREP_12.2.1.4/MaxThreadsConstraints/Max_GWS')
set('Targets',jarray.array([ObjectName('com.bea:Name=osbCluster,Type=Cluster')], ObjectName))
cmo.setCount(50)
cmo.unSet('ConnectionPoolName')

cd('/SelfTuning/DMN_OSB_PREP_12.2.1.4/WorkManagers/WM_GWS')
cmo.setMaxThreadsConstraint(getMBean('/SelfTuning/DMN_OSB_PREP_12.2.1.4/MaxThreadsConstraints/Max_GWS'))

cd('/SelfTuning/DMN_OSB_PREP_12.2.1.4')
cmo.createCapacity('CC_GWS')

cd('/SelfTuning/DMN_OSB_PREP_12.2.1.4/Capacities/CC_GWS')
set('Targets',jarray.array([ObjectName('com.bea:Name=osbCluster,Type=Cluster')], ObjectName))
cmo.setCount(100)

cd('/SelfTuning/DMN_OSB_PREP_12.2.1.4/WorkManagers/WM_GWS')
cmo.setCapacity(getMBean('/SelfTuning/DMN_OSB_PREP_12.2.1.4/Capacities/CC_GWS'))

activate()
print 'End of script ...'
exit()

