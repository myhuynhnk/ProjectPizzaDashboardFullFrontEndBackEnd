package com.devcamp.api.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "orders")
public class COrder {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "order_id", unique = true)
	private String orderId;
	
	@Column(name = "size")
	private char size;
	
	@Column(name = "diameter")
	private int diameter;
	
	@Column(name = "grill")
	private int grill;
	
	@Column(name = "count_drink")
	private int countDrink;
	
	@Column(name = "salad")
	private int salad;
	
	@Column(name = "soft_drink")
	private String softDrink;
	
	@Column(name = "type_pizza")
	private String typePizza;
	
	@Column(name = "voucher_code")
	private String voucherCode;
	
	@Column(name = "total_price")
	private long totalPrice;
	
	@Column(name = "discount")
	private long discount;
	
	@Column(name = "status")
	private String status;
	
	@Column(name = "message")
	private String message;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "create_date", nullable = true, updatable = false)
	@CreatedDate
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date createDate;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "update_date", nullable = true)
	@LastModifiedDate
	@JsonFormat(pattern = "dd-MM-yyyy")
	private Date updateDate;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	@JsonIgnoreProperties(value = "orders")
	private CUser user;

	public COrder() {
		super();
	}

	
	public COrder(long id, String orderId, char size, int diameter, int grill, int countDrink, int salad,
			String softDrink, String typePizza, String voucherCode, long totalPrice, long discount, String status,
			String message, Date createDate, Date updateDate, CUser user) {
		super();
		this.id = id;
		this.orderId = orderId;
		this.size = size;
		this.diameter = diameter;
		this.grill = grill;
		this.countDrink = countDrink;
		this.salad = salad;
		this.softDrink = softDrink;
		this.typePizza = typePizza;
		this.voucherCode = voucherCode;
		this.totalPrice = totalPrice;
		this.discount = discount;
		this.status = status;
		this.message = message;
		this.createDate = createDate;
		this.updateDate = updateDate;
		this.user = user;
	}



	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public char getSize() {
		return size;
	}

	public void setSize(char size) {
		this.size = size;
	}
	
	public int getDiameter() {
		return diameter;
	}


	public void setDiameter(int diameter) {
		this.diameter = diameter;
	}


	public int getGrill() {
		return grill;
	}

	public void setGrill(int grill) {
		this.grill = grill;
	}

	public int getCountDrink() {
		return countDrink;
	}

	public void setCountDrink(int countDrink) {
		this.countDrink = countDrink;
	}

	public int getSalad() {
		return salad;
	}

	public void setSalad(int salad) {
		this.salad = salad;
	}

	public String getSoftDrink() {
		return softDrink;
	}

	public void setSoftDrink(String softDrink) {
		this.softDrink = softDrink;
	}

	public String getTypePizza() {
		return typePizza;
	}

	public void setTypePizza(String typePizza) {
		this.typePizza = typePizza;
	}

	public String getVoucherCode() {
		return voucherCode;
	}

	public void setVoucherCode(String voucherCode) {
		this.voucherCode = voucherCode;
	}

	public long getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(long totalPrice) {
		this.totalPrice = totalPrice;
	}

	public long getDiscount() {
		return discount;
	}

	public void setDiscount(long discount) {
		this.discount = discount;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public CUser getUser() {
		return user;
	}

	public void setUser(CUser user) {
		this.user = user;
	}
	
	
}
