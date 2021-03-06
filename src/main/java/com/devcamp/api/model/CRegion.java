package com.devcamp.api.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "regions")
public class CRegion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "region_code", unique = true)
	private String regionCode;
	
	@Column(name = "region_name")
	private String regionName;
	
	@ManyToOne
	@JsonIgnore
	private CCountry country;
	
	@Transient
	private String countryName;
	@JsonIgnore
	public String getCountryName() {
		return countryName;
	}

	public void setCountryName(String countryName) {
		this.countryName = countryName;
	}
	
	public CRegion() {
		super();
	}

	public CRegion(long id, String regionCode, String regionName, CCountry country) {
		super();
		this.id = id;
		this.regionCode = regionCode;
		this.regionName = regionName;
		this.country = country;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getRegionCode() {
		return regionCode;
	}

	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}

	public String getRegionName() {
		return regionName;
	}

	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}
	
	@JsonIgnore
	public CCountry getCountry() {
		return country;
	}

	public void setCountry(CCountry country) {
		this.country = country;
	}
	
	
}

