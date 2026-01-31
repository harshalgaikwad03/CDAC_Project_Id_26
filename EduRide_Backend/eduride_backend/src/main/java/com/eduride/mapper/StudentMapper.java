package com.eduride.mapper;

import com.eduride.dto.StudentDTO;
import com.eduride.entity.Student;

public class StudentMapper {

    public static StudentDTO toDTO(Student student) {

        return new StudentDTO(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getRollNo(),
                student.getClassName(),
                student.getPhone(),
                student.getAddress(),
                student.getPassStatus(),

                student.getSchool() != null
                        ? student.getSchool().getId()
                        : null,

                student.getSchool() != null
                        ? student.getSchool().getName()
                        : null,

                student.getAssignedBus() != null
                        ? student.getAssignedBus().getId()
                        : null,

                student.getAssignedBus() != null
                        ? student.getAssignedBus().getBusNumber()
                        : null
        );
    }
}
