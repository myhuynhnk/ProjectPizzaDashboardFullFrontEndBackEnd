package com.devcamp.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.devcamp.api.model.CVoucher;

@Repository
public interface IVoucherRepository extends JpaRepository<CVoucher, Long> {

}
