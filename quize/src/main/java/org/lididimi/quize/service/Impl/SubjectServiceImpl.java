package org.lididimi.quize.service.Impl;

import jakarta.transaction.Transactional;
import org.lididimi.quize.model.dto.subject.SubjectDTO;
import org.lididimi.quize.model.dto.subject.SubjectWithQuizCountDTO;
import org.lididimi.quize.model.entity.Subject;
import org.lididimi.quize.repository.QuizRepository;
import org.lididimi.quize.repository.SubjectRepository;
import org.lididimi.quize.service.SubjectService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final ModelMapper modelMapper;
    private final QuizRepository quizRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository, ModelMapper modelMapper, QuizRepository quizRepository) {
        this.subjectRepository = subjectRepository;
        this.modelMapper = modelMapper;
        this.quizRepository = quizRepository;
    }

    @Override
    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll()
                .stream()
                .map(subject -> modelMapper.map(subject, SubjectDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<SubjectWithQuizCountDTO> getSubjectsWithQuizCounts() {
        List<Subject> subjects = subjectRepository.findAll();
        List<SubjectWithQuizCountDTO> subjectWithQuizCountDTOs = new ArrayList<>();

        for (Subject subject : subjects) {
            long quizCount = quizRepository.countBySubject(subject);
            SubjectWithQuizCountDTO dto = new SubjectWithQuizCountDTO(subject.getName(), quizCount);
            subjectWithQuizCountDTOs.add(dto);
        }

        return subjectWithQuizCountDTOs;
    }

}
