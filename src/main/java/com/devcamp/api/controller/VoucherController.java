package com.devcamp.api.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

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

import com.devcamp.api.model.CVoucher;
import com.devcamp.api.repository.IVoucherRepository;

@RestController
@RequestMapping("/voucher")
public class VoucherController {
	
	@Autowired
    IVoucherRepository pVoucherRepository;

    @CrossOrigin
    @GetMapping("/all")
    public ResponseEntity<List<CVoucher>> getAllVouchers() {
        try {
            List<CVoucher> listVoucher = new ArrayList<CVoucher>();

            pVoucherRepository.findAll().forEach(listVoucher::add);
            return new ResponseEntity<>(listVoucher, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin
    @GetMapping("/detail/{id}")
    public ResponseEntity<CVoucher> getCVoucherById(@PathVariable("id") long id) {
        try {
            CVoucher voucher = pVoucherRepository.findById(id).get();
            if (voucher != null) {
                return new ResponseEntity<>(voucher, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @CrossOrigin
    @PostMapping("/create")
    public ResponseEntity<Object> createCVoucher(@Valid @RequestBody CVoucher pVouchers) {
        try {
            pVouchers.setNgayTao(new Date());
            pVouchers.setNgayCapNhat(null);
            CVoucher _vouchers = pVoucherRepository.save(pVouchers);
            return new ResponseEntity<>(_vouchers, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("+++++++++++++++++++++::::: " + e.getCause().getCause().getMessage());
            //Hiện thông báo lỗi tra back-end
            //return new ResponseEntity<>(e.getCause().getCause().getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            return ResponseEntity.unprocessableEntity().body("Failed to Create specified Voucher: " + e.getCause().getCause().getMessage());
        }
    }

    @CrossOrigin
    @PutMapping("/update/{id}")
    public ResponseEntity<Object> updateCVoucherById(@PathVariable("id") long id, @RequestBody CVoucher pVoucher) {
        Optional<CVoucher> voucherData = pVoucherRepository.findById(id);
        if (voucherData.isPresent()) {
            CVoucher voucher = voucherData.get();
            voucher.setMaVoucher(pVoucher.getMaVoucher());
            voucher.setPhanTramGiamGia(pVoucher.getPhanTramGiamGia());
            voucher.setGhiChu(pVoucher.getGhiChu());
            voucher.setNgayCapNhat(new Date());
            try {
                return new ResponseEntity<>(pVoucherRepository.save(voucher), HttpStatus.OK);

            } catch (Exception e) {
                return ResponseEntity.unprocessableEntity().body("Failed to Update specified Voucher:" + e.getCause().getCause().getMessage());
            }
        } else {
            return ResponseEntity.badRequest().body("Failed to get specified Voucher: " + id + "  for update.");
        }
    }

    @CrossOrigin
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<CVoucher> deleteCVoucherById(@PathVariable("id") long id) {
        try {
            pVoucherRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin
    @DeleteMapping("/delete/all")
    public ResponseEntity<CVoucher> deleteAllVoucher() {
        try {
            pVoucherRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
