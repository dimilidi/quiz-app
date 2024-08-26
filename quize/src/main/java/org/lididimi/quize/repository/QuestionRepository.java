package org.lididimi.quize.repository;

import org.lididimi.quize.model.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT DISTINCT q.subject FROM Question q")
    List<String> findDistinctSubject();

    Page<Question> findBySubject(String subject, Pageable pageable);


    @Query(value = "SELECT * FROM question q WHERE q.subject = :subject ORDER BY RAND() LIMIT :numOfQuestions", nativeQuery = true)
    List<Question> findRandomQuestionsBySubject(@Param("subject") String subject, @Param("numOfQuestions") Integer numOfQuestions);

}
