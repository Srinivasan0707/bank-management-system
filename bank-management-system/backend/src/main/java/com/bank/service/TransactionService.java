package com.bank.service;

import com.bank.dto.TransactionDTO;
import com.bank.model.Account;
import com.bank.model.Transaction;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private AccountService accountService;
    
    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAllOrderByDateDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        return convertToDTO(transaction);
    }
    
    public List<TransactionDTO> getTransactionsByAccountId(Long accountId) {
        return transactionRepository.findByAccountId(accountId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public TransactionDTO createTransaction(TransactionDTO transactionDTO) {
        Account fromAccount = null;
        Account toAccount = null;
        
        // Validate and get accounts based on transaction type
        switch (transactionDTO.getTransactionType()) {
            case DEPOSIT:
                fromAccount = accountRepository.findById(transactionDTO.getFromAccountId())
                        .orElseThrow(() -> new RuntimeException("Account not found"));
                
                // Credit the account
                accountService.updateBalance(fromAccount.getId(), transactionDTO.getAmount());
                break;
                
            case WITHDRAWAL:
                fromAccount = accountRepository.findById(transactionDTO.getFromAccountId())
                        .orElseThrow(() -> new RuntimeException("Account not found"));
                
                if (fromAccount.getBalance().compareTo(transactionDTO.getAmount()) < 0) {
                    throw new RuntimeException("Insufficient balance");
                }
                
                // Debit the account
                accountService.updateBalance(fromAccount.getId(), transactionDTO.getAmount().negate());
                break;
                
            case TRANSFER:
                fromAccount = accountRepository.findById(transactionDTO.getFromAccountId())
                        .orElseThrow(() -> new RuntimeException("From account not found"));
                toAccount = accountRepository.findById(transactionDTO.getToAccountId())
                        .orElseThrow(() -> new RuntimeException("To account not found"));
                
                if (fromAccount.getBalance().compareTo(transactionDTO.getAmount()) < 0) {
                    throw new RuntimeException("Insufficient balance");
                }
                
                // Debit from source account
                accountService.updateBalance(fromAccount.getId(), transactionDTO.getAmount().negate());
                // Credit to destination account
                accountService.updateBalance(toAccount.getId(), transactionDTO.getAmount());
                break;
        }
        
        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setFromAccount(fromAccount);
        transaction.setToAccount(toAccount);
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setTransactionType(transactionDTO.getTransactionType());
        transaction.setDescription(transactionDTO.getDescription());
        transaction.setStatus(Transaction.TransactionStatus.COMPLETED);
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDTO(savedTransaction);
    }
    
    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        
        if (transaction.getFromAccount() != null) {
            dto.setFromAccountId(transaction.getFromAccount().getId());
            dto.setFromAccountNumber(transaction.getFromAccount().getAccountNumber());
        }
        
        if (transaction.getToAccount() != null) {
            dto.setToAccountId(transaction.getToAccount().getId());
            dto.setToAccountNumber(transaction.getToAccount().getAccountNumber());
        }
        
        dto.setAmount(transaction.getAmount());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setDescription(transaction.getDescription());
        dto.setTransactionDate(transaction.getTransactionDate());
        dto.setStatus(transaction.getStatus());
        
        return dto;
    }
}
