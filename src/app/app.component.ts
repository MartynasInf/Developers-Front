import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

export interface Developer {
  id: number;
  name: string;
  seniority: string;
  dob: Date;
  workplaces: Workplace[];
}

export interface Workplace {
  id: number;
  name: string;
  address: string;
  developers: Developer[];
}

export interface WorkplaceDTO {
  id: number;
  name: string;
  address: string;
}

export interface DeveloperDTO {
  id: number;
  name: string;
  seniority: string;
  dob: Date;
  workplaceDTO: WorkplaceDTO;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  //------------------------
  selectedDeveloper!: Developer;
  updateDeveloperForm!: FormGroup;
  //----------------------

  selectedWorkplace!: Workplace;
  public wrkplcs: Workplace[] = [];
  public devs: Developer[] = [];

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) {
    this.getDevs();
    this.getWorkplaces();
    
  }


  private getDevs(): void {
    this.getDevelopers().subscribe(
      (response: Developer[]) => {
        this.devs = response;
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getDevelopers(): Observable<Developer[]> {
    return this.httpClient.get<Developer[]>(
      'http://localhost:8081/api/developer/'
    );
  }

  private getWorkplaces(): void {
    this.getWorkplacesFromDB().subscribe(
      (response: Workplace[]) => {
        this.wrkplcs = response;
        //console.log(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getWorkplacesFromDB(): Observable<Workplace[]> {
    return this.httpClient.get<Workplace[]>(
      'http://localhost:8081/api/workplace/'
    );
  }

  public saveDeveloper(addForm: NgForm): void {
    this.saveDeveloperToBackEnd(addForm.value).subscribe(
      (response: DeveloperDTO) => {
        console.log('saved successfully.');
        this.getDevs();
      }
    );
  }

  public saveDeveloperToBackEnd(
    developer: DeveloperDTO
  ): Observable<DeveloperDTO> {
    console.log(developer);
    developer.workplaceDTO = this.selectedWorkplace;
    return this.httpClient.post<DeveloperDTO>(
      'http://localhost:8081/api/developer/',
      developer
    );
  }

  public saveWorkplace(addForm2: NgForm): void {
    this.saveWorkplaceToDB(addForm2.value).subscribe(
      (response: WorkplaceDTO) => {
        console.log('Workplace saved succesfully');
        this.getWorkplaces();
      }
    );
  }

  public saveWorkplaceToDB(
    workplaceDTO: WorkplaceDTO
  ): Observable<WorkplaceDTO> {
    return this.httpClient.post<WorkplaceDTO>(
      'http://localhost:8081/api/workplace/',
      workplaceDTO
    );
  }

  public deleteDeveloper(developer: Developer): void {
    this.deleteDeveloperFromDB(developer.id).subscribe((response: Developer) => {
      console.log('Developer deleted');
      this.getDevs();
    });
  }

  public deleteDeveloperFromDB(developerID: number): Observable<Developer> {
    //console.log(developer)
    return this.httpClient.delete<Developer>(
      'http://localhost:8081/api/developer/'+ developerID
    );
  }

  public onOpenModal(developer?: Developer, mode?: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    if (mode === 'edit' && developer != null) {
      //this.editdeveloper = developer;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    container?.appendChild(button);
    button.click();
  }

  public editDeveloper: Developer = {
    id: 0,
    name: '',
    seniority: '',
    dob: new Date(),
    workplaces: []
  };
}
