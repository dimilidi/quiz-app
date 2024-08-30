package org.lididimi.quize.repository;

import org.lididimi.quize.model.entity.QuizAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.student.id = :userId")
    List<QuizAttempt> findByStudentId(@Param("userId") Long userId);

    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.student.id = :userId")
    Page<QuizAttempt> findByStudentId(@Param("userId") Long userId, Pageable pageable);
}
