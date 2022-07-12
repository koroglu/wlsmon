package tr.gov.eba.demo.mp;

import java.net.InetSocketAddress;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.CqlSessionBuilder;
import com.datastax.oss.driver.api.core.cql.ResultSet;

/**
 *
 */
@Path("/hello")
@Singleton
public class HelloController {
	
	private  CqlSession session;
	
	@Inject
    @ConfigProperty(name = "cassandra.init")
    private String cassandraInit;

	
	
	@PostConstruct
	public void singletonInitialize() {
		session = CqlSession.builder().build();
		/*
		if ( cassandraInit.contains("true")) {
			session.execute("CREATE KEYSPACE IF NOT EXISTS store WITH REPLICATION={ 'class':'SimpleStrategy','replication_factor':'1'}");

			session.execute("CREATE TABLE IF NOT EXISTS store.shopping_cart ( "
					+ "userid text PRIMARY KEY, "
					+ "item_count int, "
					+ "last_update_timestamp timestamp) ");
			session.execute("INSERT INTO store.shopping_cart (userid, item_count, last_update_timestamp) VALUES ('9876', 2, toTimeStamp(now())");
		}
		*/
	}

	@GET
	public String sayHello() {
		try {
			ResultSet rs = session.execute("SELECT * FROM wls.monitoring_domains");
			return rs.one().getObject(3).toString();

		} catch (Exception e) {
			e.printStackTrace();
			return e.getLocalizedMessage();
		}

	}
}
