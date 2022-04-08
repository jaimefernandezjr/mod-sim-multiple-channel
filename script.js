// Authors: 
// Arevalo, Lance Gabrielle
// Fernandez, Jaime Jr. I.

const form = document.getElementById('form');
const inputBar = document.getElementById('input-bar'); 
const tableBody = document.getElementById('table-body');
const performanceTable = document.getElementById('performance-table');

let tableData = [];
let dataHtml = '';
let currPlace = 1;

//general performance metrics
let avgWaitingCustomer = 0;
let probabilityWait = 0;
let ableProportionIdle = 0;
let bakerProportionIdle = 0;
let ableAvgServiceTime = 0;
let bakerAvgServiceTime = 0;
let avgArrivalTime = 0;
let avgWaitingInQueue = 0;
let avgCustomerSpent = 0;

//specific perofrmance metrics
let sumWaitingTime = 0;        //1
let totalNumberOfCustomer = 0; //1
let numCustomerWait = 0;       //2
let ableSumIdleTime = 0;          //3
let bakerSumIdleTime = 0;          //3
let ableLatestTimeServiceEnd = 0; //3
let bakerLatestTimeServiceEnd = 0; //3
let ableTotalServiceTime = 0;        //4
let ableTotalNumberOfCustomer = 0; //4
let bakerTotalServiceTime = 0;        //4
let bakerTotalNumberOfCustomer = 0; //5
let sumInterarrivalTime = 0; //6
let numberOfArrivals = totalNumberOfCustomer; 
let sumSpentInSystem = 0; 

// 1. get number of iteration after submitting
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

    //general performance metrics
    avgWaitingCustomer = sumWaitingTime / totalNumberOfCustomer;
    probabilityWait = numCustomerWait / totalNumberOfCustomer;
    ableProportionIdle = ableSumIdleTime / ableLatestTimeServiceEnd;
    bakerProportionIdle = bakerSumIdleTime / bakerLatestTimeServiceEnd;
    ableAvgServiceTime = ableTotalServiceTime / ableTotalNumberOfCustomer;
    bakerAvgServiceTime = bakerTotalServiceTime / bakerTotalNumberOfCustomer;
    avgArrivalTime = sumInterarrivalTime / (totalNumberOfCustomer - 1);
    avgWaitingInQueue = sumWaitingTime / numCustomerWait;
    avgCustomerSpent = sumSpentInSystem / totalNumberOfCustomer;

    console.log(sumWaitingTime, totalNumberOfCustomer);
    console.log(numCustomerWait, totalNumberOfCustomer);
    console.log(ableSumIdleTime, ableLatestTimeServiceEnd);
    console.log(bakerSumIdleTime, bakerLatestTimeServiceEnd);
    console.log(ableTotalServiceTime, ableTotalNumberOfCustomer);
    console.log(bakerTotalServiceTime, bakerTotalNumberOfCustomer);
    console.log(sumInterarrivalTime, totalNumberOfCustomer);
    console.log(sumWaitingTime, numCustomerWait);
    console.log(sumSpentInSystem, totalNumberOfCustomer);


    generatePerformanceTable();
    
}

//3. generate performance table
let generatePerformanceTable = () => {
    let performanceHtml = `
        <tr>
            <th colspan=2>Performance metrics</th>
        <tr>
            <td class='left-align'>Average waiting time for a customer</td>
            <td class='left-align'>${avgWaitingCustomer}</td>
        </tr>
        <tr>
            <td class='left-align'>The probability that a customer has to wait in the queue</td>
            <td class='left-align'>${probabilityWait}</td>
        </tr>
        <tr>
            <td class='left-align'>The proportion of idle time of Able</td>
            <td class='left-align'>${ableProportionIdle}</td>
        </tr>
        <tr>
            <td class='left-align'>The proportion of idle time of Baker</td>
            <td class='left-align'>${bakerProportionIdle}</td>
        </tr>
        <tr>
            <td class='left-align'>Average Service Time of Able</td>
            <td class='left-align'>${ableAvgServiceTime}</td>
        </tr>
        <tr>
            <td class='left-align'>Average Service Time of Baker</td>
            <td class='left-align'>${bakerAvgServiceTime}</td>
        </tr>
        <tr>
            <td class='left-align'>Average Time Between Arrivals</td>
            <td class='left-align'>${avgArrivalTime}</td>
        </tr>
        <tr>
            <td class='left-align'>The average waiting time for those who wait in queue</td>
            <td class='left-align'>${avgWaitingInQueue}</td>
        </tr>
        <tr>
            <td class='left-align'>The average time a customer spends in the system</td>
            <td class='left-align'>${avgCustomerSpent}</td>
        </tr>
    `;
    performanceTable.innerHTML = '';
    performanceTable.innerHTML += performanceHtml;

    //reset all variables
    sumWaitingTime = 0;        //1
    totalNumberOfCustomer = 0; //1
    numCustomerWait = 0;       //2
    ableSumIdleTime = 0;          //3
    bakerSumIdleTime = 0;          //3
    ableLatestTimeServiceEnd = 0; //3
    bakerLatestTimeServiceEnd = 0; //3
    ableTotalServiceTime = 0;        //4
    ableTotalNumberOfCustomer = 0; //4
    bakerTotalServiceTime = 0;        //4
    bakerTotalNumberOfCustomer = 0; //5
    sumInterarrivalTime = 0; //6
    numberOfArrivals = totalNumberOfCustomer; 
    sumSpentInSystem = 0;
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
                this.idle = (this.arrival - this.bakerAvailable < 0) ? 0 : this.arrival - this.bakerAvailable;
                bakerLatestTimeServiceEnd = this.endsBaker;
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
                this.idle = (this.arrival - this.ableAvailable < 0) ? 0 : this.arrival - this.ableAvailable;
                ableLatestTimeServiceEnd = this.endsAble;
            }
        }

        //if customer 1
        else {
            this.place = place;
            this.chosen = 'Able';
            this.interarrivalRda = '-';
            this.interarrival = 0;
            this.beginsAble = this.arrival;
            this.serviceAbleRda = generateRandomInt();
            this.serviceAble = getServiceRdaAble(this.serviceAbleRda);
            this.endsAble = this.serviceAble + this.beginsAble;
            this.spent = this.serviceAble + this.waiting;
            ableLatestTimeServiceEnd = this.endsAble;
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
        
        //specific performance metrics
        sumWaitingTime += this.waiting; 
        totalNumberOfCustomer = tableData.length + 1;

        //get the number of customer who waited
        if(this.waiting > 0) {
            numCustomerWait ++;
        }

        //get sumIdleTime able
        if(this.chosen === 'Able'){
            ableSumIdleTime += this.idle;
        }

        //get sumIdleTime baker
        if(this.chosen === 'Baker'){
            bakerSumIdleTime += this.idle;
        }

        //get able total service time
        if(this.chosen === 'Able'){
            ableTotalServiceTime += this.serviceAble;
        } else {
            bakerTotalServiceTime += this.serviceBaker;
        }

        //get total number of customer for able and baker
        if(this.chosen === 'Able'){
            ableTotalNumberOfCustomer ++;
        } else {
            bakerTotalNumberOfCustomer ++;
        }

        //get sum of interarrival time
        sumInterarrivalTime += this.interarrival;

        //get sum of time spent in the system
        sumSpentInSystem += this.spent;

        

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