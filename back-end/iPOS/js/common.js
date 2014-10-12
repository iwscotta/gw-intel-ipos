
function GetFromLocalStorage(key) {
    var data = localStorage.getItem(key);
    if (data == "undefined") {
        localStorage.removeItem(key);
        data == null;
    }

    return data;
}

function SaveToLocalStorage(key, data) {
    if (data == null) {
        return;
    }

    if (data == "undefined") {
        return;
    }

    localStorage.setItem(key, data);
}

function ReadXmlNode(xml, node) {
    var items = xml.querySelectorAll(node);
    if (items) {
        return items[0].textContent;
    }
    return "";
}

function ReadXmlNodes(xml, node) {
    var items = xml.querySelectorAll(node);
    return items;
}

function ReadXmlNodeAttribute(xml, node, attributeName) {
    var items = xml.querySelectorAll(node);
    if (items) {
        return items[0].attributes[attributeName].textContent;
    }
    return "";
}

function CreateMachineSpecObj() {
    var data = GetFromLocalStorage("machinespec");
    if (data == null) {
        return null;
    }
    var xml = $.parseXML(data);
    var machine = {};
    machine.cpu = ReadXmlNode(xml, "profile hardware cpu name");
    machine.ram = ReadXmlNode(xml, "profile hardware storage ram");

    machine.graphicscapability = ReadXmlNodeAttribute(xml, "profile hardware graphics", "intelGraphicsCapability");
    machine.graphicsdescription = ReadXmlNodeAttribute(xml, "profile hardware graphics", "inUseDescription");
    machine.diskcapacity = ReadXmlNodeAttribute(xml, "profile hardware storage diskDrives drive", "capacity");
    machine.disktype = ReadXmlNodeAttribute(xml, "profile hardware storage diskDrives drive", "type");
    machine.diskmanufacturer = ReadXmlNodeAttribute(xml, "profile hardware storage diskDrives drive", "manufacturer");
    machine.os = ReadXmlNode(xml, "profile hardware operatingSystem name");

    machine.manufacturer = ReadXmlNode(xml, "profile hardware cpu manufacturer");
    machine.model = ReadXmlNode(xml, "profile hardware cpu model");
    return machine;
}

function CreateAnalyticObject() {
    var data = GetFromLocalStorage("analytic");
    return null;
}