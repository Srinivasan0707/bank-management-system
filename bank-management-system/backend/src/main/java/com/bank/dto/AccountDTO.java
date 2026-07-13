package com.bank.dto;

import com.bank.model.Account;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private Long id;
    private String accountNumber;
    private Long customerId;
    private String customerName;
    private Account.AccountType accountType;
    private BigDecimal balance;
    private Account.AccountStatus status;
}
