package org.lididimi.quize.service;

import org.lididimi.quize.model.dto.subject.SubjectDTO;
import org.lididimi.quize.model.entity.Subject;

import java.util.List;

public interface SubjectService {
    List<SubjectDTO> getAllSubjects();
}
