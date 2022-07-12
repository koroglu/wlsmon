package com.oracle.acs.dao;

import javax.annotation.PostConstruct;
import javax.inject.Singleton;

import com.datastax.oss.driver.api.core.CqlSession;



@Singleton
public class CassandraDAO {

	private CqlSession session;

	@PostConstruct
	public void singletonInitialize() {
		session = CqlSession.builder().build();
	}

	public CqlSession getSession() {
		return this.session;
	}

}
