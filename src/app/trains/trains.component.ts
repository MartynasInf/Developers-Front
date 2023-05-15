import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';

export interface Train {
  id: number;
  name: string;
  capacity: number;
  yearCreated: number;
  destinations: Destination[];
}

export interface Destination {
  id: any;
  name: string;
  distance: number;
  trainID: number;
}


@Component({
  selector: 'app-trains',
  templateUrl: './trains.component.html',
  styleUrls: ['./trains.component.css'],
})
export class TrainsComponent {
  constructor(private httpClient: HttpClient) {
    this.getTrainsFromBackend();
  }

  public trains: Train[] = [];
  public updateTrain!: Train;
  public selectedTrain!: number;

  ngOnInit(): void {}

  private getTrainsFromBackend(): void {
    this.getTrains().subscribe(
      (response: Train[]) => {
        this.trains = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public getTrains(): Observable<Train[]> {
    return this.httpClient.get<Train[]>('http://localhost:8081/trains/all/');
  }

  public saveTrain(addForm: NgForm): void {
    this.saveTrainToBackEnd(addForm.value).subscribe((response: Train) => {
      this.getTrainsFromBackend();
    });
  }

  public saveTrainToBackEnd(train: Train): Observable<Train> {
    return this.httpClient.post<Train>('http://localhost:8081/trains/', train);
  }

  public updateForm(train: Train) {
    this.updateTrain = train;
  }

  public deleteTrain(train: Train): void {
    this.deleteTrainFromDB(train.id).subscribe((response: Train) => {
      this.getTrainsFromBackend();
    });
  }

  public deleteTrainFromDB(trainID: number): Observable<Train> {
    //console.log(developer)
    return this.httpClient.delete<Train>(
      'http://localhost:8081/trains/'+ trainID
    );
  }

  public saveDestination(addForm2: NgForm): void {
    const destination: Destination = {
      id: '',
      name: addForm2.value.name,
      distance: addForm2.value.distance,
      trainID: this.selectedTrain
    };
    this.saveDestinationToBackEnd(destination).subscribe((response: Destination) => {
      this.getTrainsFromBackend();
    });
  }

  public saveDestinationToBackEnd(destination: Destination): Observable<Destination> {
    console.log(destination)
    console.log(this.selectedTrain)
    return this.httpClient.post<Destination>('http://localhost:8081/destination/', destination);
  }


  public deleteDestination(destinationId: number): void {
    this.deleteDestinationFromDB(destinationId).subscribe((response: Destination) => {
      this.getTrainsFromBackend();
    });
  }

  public deleteDestinationFromDB(destinationId: number): Observable<Destination> {
    //console.log(developer)
    return this.httpClient.delete<Destination>(
      'http://localhost:8081/destination/' + destinationId,
    );
  }
}
