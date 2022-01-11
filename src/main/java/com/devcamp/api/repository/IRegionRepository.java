package com.devcamp.api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devcamp.api.model.CRegion;

@Repository
public interface IRegionRepository extends JpaRepository<CRegion, Long>{
	List<CRegion> findByCountryId(long countryId);
	Optional<CRegion> findByIdAndCountryId(long id, long instructorId);
	
}
