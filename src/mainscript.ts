/**
 * Created by VKirilenko on 04.07.2017.
 */

//элементы страницы
var btAdd = <HTMLInputElement>document.getElementById('vehicleAdd');
var radios = <NodeList>document.getElementsByName('vehicleType');
var vehicleName = <HTMLInputElement>document.getElementById('vehicleName');
var vehicleWeight = <HTMLInputElement>document.getElementById('vehicleWeight');
var vehicleDescription = <HTMLInputElement>document.getElementById('vehicleDescription');
var vehicleList = <HTMLSelectElement>document.getElementById('vehicleList');
var vehicleDetails = <HTMLElement>document.getElementById('vehicleDetails');


//Базовый класс
class Vehicle {
    constructor(protected name: string, protected description: string) {

    }

    // информация для отображения в списке машин
    showLabel = () => "";

    protected showLabelByTemplate(spicifyValue:string, spicifyUnit: string): string {
        return `<option>${this.name}: ${spicifyValue} ${spicifyUnit}</option>`;
    }

    // информация для отображения под списком машин,
    // при выборе строки в списке
    showInfo = () => "";

    protected showInfoByTemplate(spicificType:string, spicificName:string, spicificValue:string, spicificUnit: string): string {
        return `Тип: ${spicificType} <br />
                Модель: ${this.name} <br />
                ${spicificName}: ${spicificValue} ${spicificUnit} <br />
                Примечание: ${this.description} <br />
                `;
    }
}

//Наследники для грузовых транспортных средств:
class Truck extends Vehicle {

    private static readonly SPICIFIC_TYPE = "грузовая";
    private static readonly SPICIFIC_NAME = "Грузоподъемность";
    private static readonly SPICIFIC_UNIT = "т.";

    constructor(protected name: string, protected description: string, protected carrying: string) {
        super(name, description);
    }

    // информация для отображения в списке машин
    showLabel = () => super.showLabelByTemplate(this.carrying, Truck.SPICIFIC_UNIT);

    // информация для отображения под списком машин,
    // при выборе строки в списке
    showInfo = () => super.showInfoByTemplate(Truck.SPICIFIC_TYPE, Truck.SPICIFIC_NAME, this.carrying, Truck.SPICIFIC_UNIT);
}

//Для легковых:
class Car extends Vehicle {
    private static readonly SPICIFIC_TYPE = "легковая";
    private static readonly SPICIFIC_NAME = "Скорость";
    private static readonly SPICIFIC_UNIT = "км/ч";

    constructor(protected name: string, protected description: string, protected velocity: string) {
        super(name, description);
    }

    // информация для отображения в списке машин
    showLabel = () => super.showLabelByTemplate(this.velocity, Car.SPICIFIC_UNIT);


    // информация для отображения под списком машин,
    // при выборе строки в списке
    showInfo = () => super.showInfoByTemplate(Car.SPICIFIC_TYPE, Car.SPICIFIC_NAME, this.velocity, Car.SPICIFIC_UNIT);
}


//Для хранения списка машин использовать один объет – массив.
interface IVehicleList{
    vehicle:Vehicle;
    onClick():string;
}
let vehicles = Array<IVehicleList>();

btAdd.onclick = () => {
    var type = getValueFromRadioButtons(radios);
    if (type == null) {
        alert("Выберите тип машины");
        return;
    }

    var vehicleNameVal = vehicleName.value, vehicleDescriptionVal = vehicleDescription.value,
        vehicleWeightVal = vehicleWeight.value;

    var vehicle = (type == "Truck") ?
        new Truck(vehicleNameVal, vehicleDescriptionVal, vehicleWeightVal) :
        new Car(vehicleNameVal, vehicleDescriptionVal, vehicleWeightVal);

    vehicles.push({
        vehicle: vehicle,
        onClick: vehicle.showInfo.bind(vehicle)
    });

    var template = document.createRange().createContextualFragment(vehicle.showLabel.call(vehicle));
    vehicleList.appendChild(template);

    // обнудяем поля
    vehicleName.value = vehicleDescription.value = vehicleWeight.value = "";

}

vehicleList.onchange = () => {
    vehicleDetails.innerHTML = vehicles[vehicleList.selectedIndex].onClick();
}

let getValueFromRadioButtons = (nodeList: NodeList) => {
    if (nodeList == null){
        return null;
    }

    for (let i = 0; i<nodeList.length; i++){
        let a:HTMLInputElement  = nodeList.item(i) as HTMLInputElement;
        if (a.checked) {
            return a.value;
        }
    }

    return null;
}

//for test****************
function InitData() {
    var v1 = new Truck("Mersedes", "description1 ", "3");
    vehicles.push({
        vehicle: v1,
        onClick: v1.showInfo.bind(v1)
    });
    var template = document.createRange().createContextualFragment(v1.showLabel());
    vehicleList.appendChild(template);
    var v2 = new Car("Honda", "description2 ", "250");
    vehicles.push({
        vehicle: v2,
        onClick: v2.showInfo.bind(v2)
    });
    var template = document.createRange().createContextualFragment(v2.showLabel());
    vehicleList.appendChild(template);
};
InitData();
//end test