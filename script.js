const form = document.getElementById('form');
const inputBar = document.getElementById('input-bar'); 
const tableBody = document.getElementById('table-body');

let tableData = [];
let dataHtml = '';
let currPlace = 1;

// 1. get number of iteration upon after submitting
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    dataHtml = `
        <tr>
            <th rowspan=3>Customer</th>
            <th rowspan=3>Interarrival Time RDA</th>
            <th rowspan=3>Interarrival Time</th>
            <th rowspan=3>Arrival Time</th>
            <th rowspan=3>When Able is Available</th>
            <th rowspan=3>When Baker is Available</th>
            <th rowspan=3>Chosen Server</th>
            <th colspan=4>ABLE</th>
            <th colspan=4>BAKER</th>
            <th rowspan=3>Waiting Time in Queue</th>
            <th rowspan=3>Time Spent in the System</th>
            <th rowspan=3>Idle Time of Current Server</th>
        <tr>
        <tr>
            <th>Time Service Begins</th>
            <th>Service Time RDA</th>
            <th>Service Time</th>
            <th>Time Service Ends</th>
            <th>Time Service Begins</th>
            <th>Service Time RDA</th>
            <th>Service Time</th>
            <th>Time Service Ends</th>
        <tr>
    `;
    tableData = [];
    currPlace = 1;
    let numIter = inputBar.value;

    generateNumIter(numIter);
});

// 2. generate the number of iteration
let generateNumIter = (numIter) => {
    for(let i = 0; i < numIter; i++){
        new Customer(currPlace);
        currPlace++;
    }
    dataToHtml();
    tableBody.innerHTML = '';
    tableBody.innerHTML += dataHtml;
}

//convert data to html
let dataToHtml = () => {
    tableData.forEach(data => {
    dataHtml += `
        <tr>
            <td>${data.place}</td>
            <td>${data.interarrivalRda}</td>
            <td>${data.interarrival}</td>
            <td>${data.arrival}</td>
            <td>${data.ableAvailable}</td>
            <td>${data.bakerAvailable}</td>
            <td>${data.chosen}</td>
            <td>${data.beginsAble}</td>
            <td>${data.serviceAbleRda}</td>
            <td>${data.serviceAble}</td>
            <td>${data.endsAble}</td>
            <td>${data.beginsBaker}</td>
            <td>${data.serviceBakerRda}</td>
            <td>${data.serviceBaker}</td>
            <td>${data.endsBaker}</td>
            <td>${data.waiting}</td>
            <td>${data.spent}</td>
            <td>${data.idle}</td>
        </tr>
    `
    });
}

class Customer {
    constructor(place){
        this.place = 0;
        this.interarrivalRda = 0;
        this.interarrival = 0;
        this.arrival = 0;
        this.chosen = '';
        this.ableAvailable = 0;
        this.bakerAvailable = 0;
        this.beginsAble = 0;
        this.serviceAbleRda = 0;
        this.serviceAble = 0;
        this.endsAble = 0;
        this.beginsBaker = 0;
        this.serviceBakerRda = 0;
        this.serviceBaker = 0;
        this.endsBaker = 0;
        this.waiting = 0;
        this.spent = 0;
        this.idle = 0;

        this.place = place;

        // if not customer 1
        let prevCust = tableData[tableData.length - 1];
        if(tableData.length != 0) {

            this.place = prevCust.place + 1;
            this.interarrivalRda = generateRandomInt();
            this.interarrival = getIatRdaEquiv(this.interarrivalRda);
            this.arrival = this.interarrival + prevCust.arrival;
            this.ableAvailable = (prevCust.endsAble > prevCust.ableAvailable) ? prevCust.endsAble : prevCust.ableAvailable;
            this.bakerAvailable = (prevCust.endsBaker > prevCust.bakerAvailable) ? prevCust.endsBaker : prevCust.bakerAvailable;

            //go to baker
            if(this.ableAvailable > this.bakerAvailable && this.ableAvailable > this.arrival){
                this.chosen = 'Baker';

                //if cust is late, else if early
                this.beginsBaker = (this.arrival >= this.bakerAvailable) ? this.arrival : this.bakerAvailable;
                this.serviceBakerRda = generateRandomInt();
                this.serviceBaker = getServiceRdaBaker(this.serviceBakerRda);
                this.endsBaker = this.serviceBaker + this.beginsBaker;
                this.beginsAble = '-';
                this.serviceAbleRda = '-';
                this.serviceAble = '-';
                this.idle = (this.chosen === 'Able') ? this.arrival - this.ableAvailable : this.arrival - this.bakerAvailable;
            } 

            //go to able
            else {
                this.chosen = 'Able';

                //if cust is late, else if early
                this.beginsAble = (this.arrival >= this.ableAvailable) ? this.arrival : this.ableAvailable;
                this.serviceAbleRda = generateRandomInt();
                this.serviceAble = getServiceRdaAble(this.serviceAbleRda);
                this.endsAble = this.serviceAble + this.beginsAble;
                this.beginsBaker = '-';
                this.serviceBakerRda = '-';
                this.serviceBaker = '-';
                this.idle = (this.chosen == 'Able') ? this.arrival - this.ableAvailable : this.arrival - this.bakerAvailable;
            }
        }
        
        //if customer 1
        else {
            this.chosen = 'Able';
            this.interarrivalRda = '-';
            this.interarrival = '-';
            this.beginsAble = this.arrival;
            this.serviceAbleRda = generateRandomInt();
            this.serviceAble = getServiceRdaAble(this.serviceAbleRda);
            this.endsAble = this.serviceAble + this.beginsAble;
            this.spent = this.serviceAble + this.waiting;
        }

        //get waiting time
        if(this.arrival < this.ableAvailable && this.arrival < this.bakerAvailable){
            this.waiting = (this.bakerAvailable >= this.ableAvailable) 
                ? this.ableAvailable - this.arrival 
                : this.bakerAvailable - this.arrival;
        }

        //get time spent
        this.spent = (this.chosen === 'Able')
            ? this.serviceAble + this.waiting
            : this.serviceBaker + this.waiting;

        //convert negative idle to 0
        if(this.idle < 0) {
            this.idle = 0;
        }

        tableData.push({
            place: this.place,
            interarrivalRda: this.interarrivalRda,
            interarrival: this.interarrival,
            arrival: this.arrival,
            chosen: this.chosen,
            ableAvailable: this.ableAvailable,
            bakerAvailable: this.bakerAvailable,
            beginsAble: this.beginsAble,
            serviceAbleRda: this.serviceAbleRda,
            serviceAble: this.serviceAble,
            endsAble: this.endsAble,
            beginsBaker: this.beginsBaker,
            serviceBakerRda: this.serviceBakerRda,
            serviceBaker: this.serviceBaker,
            endsBaker: this.endsBaker,
            waiting: this.waiting,
            spent: this.spent,
            idle: this.idle
        });
    }
}

let getIatRdaEquiv = (rda) => {
    return (rda <= 25) ? 1 
        : (rda <= 65) ? 2 
        : (rda <= 85) ? 3
        : (rda <= 100) ? 4
        : -1
}

let getServiceRdaAble = (rda) => {
    return (rda <= 30) ? 2 
        : (rda <= 58) ? 3 
        : (rda <= 83) ? 4
        : (rda <= 100) ? 5
        : -1
}

let getServiceRdaBaker= (rda) => {
    return (rda <= 35) ? 3 
        : (rda <= 60) ? 4 
        : (rda <= 80) ? 5
        : (rda <= 100) ? 6
        : -1
}

//generates a random number for RDA
function generateRandomInt(){
    return Math.floor(Math.random() * (100 - 1 + 1) + 1);
}