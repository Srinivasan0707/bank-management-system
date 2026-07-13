package com.bank.repository;

import com.bank.model.Account;
import com.bank.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    List<Transaction> findByFromAccountOrderByTransactionDateDesc(Account account);
    
    List<Transaction> findByToAccountOrderByTransactionDateDesc(Account account);
    
    @Query("SELECT t FROM Transaction t WHERE t.fromAccount.id = ?1 OR t.toAccount.id = ?1 ORDER BY t.transactionDate DESC")
    List<Transaction> findByAccountId(Long accountId);
    
    List<Transaction> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t ORDER BY t.transactionDate DESC")
    List<Transaction> findAllOrderByDateDesc();
}
