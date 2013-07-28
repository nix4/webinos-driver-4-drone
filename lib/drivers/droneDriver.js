/*******************************************************************************
 *  Code contributed to the webinos project
 * 
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Copyright 2013
 * 
 ******************************************************************************/


(function () {
    'use strict';

    var driverId = null;
    var registerFunc = null;
    var callbackFunc = null;
    var droneControllerInstance = require("drone-controller");

    var elementsList = new Array;

    elementsList[0] = {
        'type': 'linearmotor',
        'name': 'webinos Drone Controller',
        'description': 'A driver for controlling drone AR',
        'sa': 1,
        'range' : [ [0,14] ],
        'interval': 0,
        'value': 0,
        'running': false,
        'id': 0
    };

    exports.init = function(dId, regFunc, cbkFunc) {
        console.log('Drone Driver Init - id is '+dId);
        driverId = dId;
        registerFunc = regFunc;
        callbackFunc = cbkFunc;
        setTimeout(intReg, 2000);
    };

    var droneCMDMap = {
        0: {operation: droneControllerInstance.control.takeoff, param: 0.2},
        1: {operation: droneControllerInstance.control.land},
        2: {operation: droneControllerInstance.control.stop},
        3: {operation: droneControllerInstance.control.movement.up, param: 0.2},
        4: {operation: droneControllerInstance.control.movement.down, param: 0.2},
        5: {operation: droneControllerInstance.control.movement.front, param: 0.2},
        6: {operation: droneControllerInstance.control.movement.back, param: 0.2},
        7: {operation: droneControllerInstance.control.turn.left, param: 0.2},
        8: {operation: droneControllerInstance.control.turn.right, param: 0.2},
        9: {operation: droneControllerInstance.control.turn.clockwise, param: 0.2},
        10: {operation: droneControllerInstance.control.turn.counterClockwise, param: 0.2},
        11: {operation: droneControllerInstance.feature.streamVideo, param: 1},
        12: {operation: droneControllerInstance.feature.streamImages, param: 1},
        13: {operation: droneControllerInstance.feature.getNavigationData},
        14: {operation: droneControllerInstance.feature.calibrate}
    }
    exports.execute = function(cmd, eId, data, errorCB, successCB) {
        //console.log('Fake driver 1 data - element is '+eId+', data is '+data);
        switch(cmd) {
            case 'value':
                console.log('Received value for element '+eId+'; value is '+data);
                var droneCtrlInterface = droneCMDMap[data];
                if(droneCtrlInterface){
                    var operation = droneCtrlInterface.operation;
                    var operationParam  = droneCtrlInterface.param;

                    if(operation) {
                        var cb = function(msg){
                            console.log("Completed operation on drone:" + msg);
                             /*if(successCB && successCB instanceof Function)
                             successCB("Completed operation on drone:" + msg);*/
                        }
                        if(operationParam)
                            operation(operationParam, cb);
                        else
                            operation(cb);
                    } else{
                        console.log("Operation for value " + data + " is not yet supported");
                       /* if(errorCB)
                            errorCB("Operation for value " + data + " is not yet supported");*/
                    }
                }
                else {
                    console.log("Interface not yet supported");
                    /*if(errorCB)
                        errorCB("Interface not yet supported");*/
                }

                break;
            default:
                console.log('Operation not supported by drone - unrecognized cmd');
        }
    }


    function intReg() {
        console.log('\nDrone driver - register new elements');
        for(var i in elementsList) {
            var json_info = {type:elementsList[i].type, name:elementsList[i].name, description:elementsList[i].description, range:elementsList[i].range};
            elementsList[i].id = registerFunc(driverId, elementsList[i].sa, json_info);
            //elementsList[i].id = registerFunc(driverId, elementsList[i].sa, elementsList[i].type);
        };
    }

}());
