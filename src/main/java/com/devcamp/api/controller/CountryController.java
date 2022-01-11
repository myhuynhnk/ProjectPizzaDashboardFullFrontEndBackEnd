package com.devcamp.api.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devcamp.api.model.CCountry;
import com.devcamp.api.repository.ICountryRepository;

@RestController
@RequestMapping("/country")
public class CountryController {
	@Autowired
	ICountryRepository countryRepository;
	
	@CrossOrigin
	@GetMapping("/all")
	public ResponseEntity<List<CCountry>> getAllCountry() {
		try {
			List<CCountry> listCountry = new ArrayList<>();
			countryRepository.findAll().forEach(listCountry::add);
			return new ResponseEntity<>(listCountry, HttpStatus.OK);
		} catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@CrossOrigin
	@GetMapping("/detail/{id}")
	public ResponseEntity<CCountry> getCountryById(@PathVariable("id") long id) {
		try {
			CCountry country = countryRepository.findById(id).get();
			if(country != null) {
				return new ResponseEntity<>(country, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
			
		} catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@CrossOrigin
	@GetMapping("/{countryCode}")
	public ResponseEntity<CCountry> getCountryByCountryCode(@PathVariable(value = "countryCode") String countryCode) {
		try {
			CCountry country = countryRepository.findByCountryCode(countryCode);
			if(country != null) {
				return new ResponseEntity<>(country, HttpStatus.OK);
			}else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			// TODO: handle exception
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@CrossOrigin
	@PostMapping("/create")
	public ResponseEntity<Object> createCountry(@RequestBody CCountry pCountry) {
		try {
			CCountry newCountry = countryRepository.save(pCountry);
			return new ResponseEntity<>(newCountry, HttpStatus.CREATED);
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println("+++++++++++++++++:::::: " + e.getCause().getCause().getMessage());
			return ResponseEntity.unprocessableEntity().body("Failed to Create specified country: " + e.getCause().getCause().getMessage());
		}
	}
	
	@CrossOrigin
	@PutMapping("/update/{id}")
	public ResponseEntity<Object> updateCountry(@PathVariable("id") long id, @RequestBody CCountry pCountry) {
		Optional<CCountry> countryOptional = countryRepository.findById(id);
		if(countryOptional.isPresent()) {
			CCountry countryUpdate = countryOptional.get();
			countryUpdate.setCountryCode(pCountry.getCountryCode());
			countryUpdate.setCountryName(pCountry.getCountryName());
			countryUpdate.setRegions(pCountry.getRegions());
			CCountry savedCountryUpdate = countryRepository.save(countryUpdate);
			try {
				return new ResponseEntity<>(savedCountryUpdate, HttpStatus.OK);
			} catch (Exception e) {
				// TODO: handle exception
				System.out.println("+++++++++++++++++:::::: " + e.getCause().getCause().getMessage());
				return ResponseEntity.unprocessableEntity().body("Failed to Create specified country: " + e.getCause().getCause().getMessage());
			}
		} else {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@CrossOrigin
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<CCountry> deleteCountryById(@PathVariable("id") long id) {
		try {
			Optional<CCountry> countryOptional = countryRepository.findById(id);
			if(countryOptional.isPresent()) {
				countryRepository.deleteById(id);
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			} else {
				return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			// TODO: handle exception
			System.out.println(e);
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
}
