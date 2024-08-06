package com.duy.shopping.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
public class ReportAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_accuser")
    private User accuser;

    @ManyToOne
    @JoinColumn(name = "id_accused")
    private User accused;

    private String title;

    @Lob
    @Size(max = 10000)
    private String content;

    private Date dateSend;
    private String status;
    private String reasonReject;
}