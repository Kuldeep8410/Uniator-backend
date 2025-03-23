

function SelectDep(params){
    if(params === "bcs"){
        return "CSE";
    }
    else if(params === "bec"){
        return "ECE";
    }
    else if(params === "bme"){
        return "MEC";
    }
    else if(params === "bce"){
        return "CE";
    }
    else if(params === "bee"){
        return "EE";
    }
    else if(params === "bba"){
        return "BBA";
    }
    else return  "Explicit"

}
module.exports = SelectDep;