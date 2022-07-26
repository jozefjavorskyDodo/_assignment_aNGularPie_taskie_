
"use strict";
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// Had to use some Node.js + npm "proxy" because
// vanilla JS fetch ( API endpoint/${key} )
// being blocked by CORS browser policies.
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// Postman retrieval of request, response went also nice.
// Hence Postman middleware would be also posibillity then...
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// Did staff with datas entrie if :
// 1. there is valid EmployeeName, EmployeeName not equals null
// 2. StartTime happend before, is less than EndTime in minutes since midnight
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
try {

    const express = require("express");
    const axios = require("axios");

    const app = express();
    const port = 5500;

    const keyy = "                                                        ";
    const API_endpoint = "https://rc-vault-fap-live-1.azurewebsites.net" +
        `/api/gettimeentries?code=${keyy}`;

    var config = {
        method: "GET",
        url: String(API_endpoint),
        headers: {}
    };

    let __favicon_href = "data:image/x-icon;" +
        "base64," +
        "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIA" +
        "AACQkWg2AAAAAXNSR0IArs4c6QAAAARnQU1B" +
        "AACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdv" +
        "qGQAAABSSURBVDhPzYxRCgAgCEM9t+fuABHG" +
        "NKNhfTX2sQ2f8iJtWrQDM1FlwH6YsccFuwOx" +
        "7gE191NA9Q5jjwv2kKgyQLB88DNAjLMhT1QL" +
        "UPQELiTSAXhSszHbt2UeAAAAAElFTkSuQmCC";

    var pseudo_fetch = '';

    let EmployeeName_EndMinusStart = [];

    let PseudoValidated_name_minutes = [];

    let sorted_PseudoValidated = [];

    var innerTexts_table = [];

    app.get('/', (req, res) => {
        axios(config)
            .then(function (response) {
                pseudo_fetch = JSON.stringify(response.data);
            })
            .then(() => {
                pseudo_fetch = [...JSON.parse(pseudo_fetch)];
                for (let item in pseudo_fetch) {
                    if (
                        pseudo_fetch[item]["EmployeeName"] === null
                    ) {
                        continue;
                    } else {
                        let StartTime = String(pseudo_fetch[item]["StarTimeUtc"]).split('T')[1];
                        let EndTime = String(pseudo_fetch[item]["EndTimeUtc"]).split('T')[1];
                        let StartTime_in_minutes_since_midnight = Number(0);
                        let EndTime_in_minutes_since_midnight = Number(0);
                        {
                            EmployeeName_EndMinusStart.push(String(pseudo_fetch[item]["EmployeeName"]));
                        };
                        {
                            StartTime_in_minutes_since_midnight = Number(
                                Number(
                                    String(StartTime).split(':')[0]
                                ) * 60
                                +
                                Number(
                                    String(StartTime).split(':')[1]
                                )
                            );
                            EndTime_in_minutes_since_midnight = Number(
                                Number(
                                    String(EndTime).split(':')[0]
                                ) * 60
                                +
                                Number(
                                    String(EndTime).split(':')[1]
                                )
                            );
                            EmployeeName_EndMinusStart.push(
                                EndTime_in_minutes_since_midnight - StartTime_in_minutes_since_midnight
                            );
                        };
                    };
                };
            })
            .then(() => {
                for (let item___ in EmployeeName_EndMinusStart) {
                    if (
                        (typeof EmployeeName_EndMinusStart[item___] === "string")
                        &&
                        (
                            PseudoValidated_name_minutes.includes(EmployeeName_EndMinusStart[item___])
                            ===
                            Boolean(false)
                        )
                    ) {
                        PseudoValidated_name_minutes.push(
                            String(
                                EmployeeName_EndMinusStart[item___]
                            )
                        );
                        PseudoValidated_name_minutes.push(
                            Number(0)
                        );
                    } else { continue; };
                };
            })
            .then(() => {
                for (let indx = 0; indx <= EmployeeName_EndMinusStart.length - 1; indx++) {
                    if (
                        (typeof EmployeeName_EndMinusStart[indx] === "number")
                        &&
                        (EmployeeName_EndMinusStart[indx] > Number(0))
                    ) {
                        for (let yndx = 0; yndx <= PseudoValidated_name_minutes.length - 1; yndx++) {
                            if (PseudoValidated_name_minutes[yndx] === EmployeeName_EndMinusStart[indx - 1]) {
                                PseudoValidated_name_minutes[yndx + 1] += EmployeeName_EndMinusStart[indx];
                                break;
                            } else { continue; };
                        };
                    } else {
                        continue;
                    };
                };
            })
            .then(() => {
                {
                    for (let item in PseudoValidated_name_minutes) {
                        if (
                            typeof PseudoValidated_name_minutes[item] === "number"
                        ) {
                            sorted_PseudoValidated.push(
                                PseudoValidated_name_minutes[item]
                            );
                        } else { continue; };
                    };
                };
                {
                    sorted_PseudoValidated.sort(
                        (a, b) => a - b
                    );
                };
            })
            .then(() => {
                {
                    for (let indx in sorted_PseudoValidated) {
                        for (let yndx in PseudoValidated_name_minutes) {
                            if (sorted_PseudoValidated[indx] === PseudoValidated_name_minutes[yndx]) {
                                innerTexts_table.push(
                                    {
                                        EmpName: `${PseudoValidated_name_minutes[yndx - 1]}`,
                                        TotalHours: `${Math.round(sorted_PseudoValidated[indx] / 60)}`
                                    }
                                );
                                break;
                            };
                        };
                    };
                };
            })
            .then(() => {
                var ng_table_CSS = () => {
                    return (
                        `
                        <style>
                            table {
                                background-color: rgb(122, 122, 244);
                                color: rgba(0, 0, 0, 1);
                                border-radius: 4mm;
                                border-spacing: 0;
                                margin: 4mm 0 0 2mm;
                                border: 1.4mm solid rgba(0, 0, 0, 1);
                                box-shadow: 0 0 6mm 3mm rgb(0, 0, 0);
                            }
                            th {
                                text-align: center;
                                font-family: cursive;
                                font-weight: 900;
                                font-size: 5mm;
                                padding: 0.2px 2mm 0.2px 2mm;
                                background-color: rgb(122, 122, 122);
                                color: rgba(244, 244, 244, 1);
                            }
                            th:nth-child(1) {
                                border-right: 0.7mm solid rgba(0, 0, 0, 1);
                            }
                            tbody > tr:nth-child(1) {
                                background-color: rgb(244, 122, 122);
                            }
                            td {
                                text-align: center;
                                font-family: cursive;
                                font-weight: 800;
                                font-size: 4mm;
                                border-top: 0.1px solid rgba(0, 0, 0, 1);
                                padding: 0.2px 2mm 0.2px 2mm;
                            }
                            td:nth-child(1) {
                                border-right: 0.7mm solid rgba(0, 0, 0, 1);
                            }
                        </style>
                        `
                    );
                };
                var ng_script = () => {
                    return (
                        `
                        <script
                            src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js">
                            </script>
                        `
                    );
                };
                var GoogleChart_script = () => {
                    return (
                        `
                        <script
                            type="text/javascript"
                            src="https://www.gstatic.com/charts/loader.js">
                            </script>
                        `
                    );
                };
                var ng_tryout = () => {
                    // return (
                    //     innerTexts_table.map(employee => {
                    //         return (
                    //             `
                    //             <h3 style="margin: 0mm 1vw 0pc 1vh" class="toRemove">
                    //                 <small>
                    //                     <b>${employee.EmpName +
                    //             "\u00a0" +
                    //             ':' +
                    //             "\u00a0" +
                    //             + employee.TotalHours}</b>
                    //                 </small>
                    //             </h3>
                    //             `
                    //         );
                    //     })
                    // );
                    return (
                        `
                        <div ng-app="myApp" ng-controller="employeesCtrl">
                            <table>
                                <thead>
                                    <tr>
                                        <th>NAME</th>
                                        <th>TOTAL HOURS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr ng-repeat="employeeEntry in employeesEntries">
                                        <td>{{ employeeEntry.Name }}</td>
                                        <td>{{ employeeEntry.TotalHours }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <script>
                            var app = angular.module('myApp', []);
                            app.controller("employeesCtrl", function($scope) {
                                $scope.employeesEntries = [
                                    {Name: "Tamoy Smith", TotalHours: 91},
                                    {Name: "Raju Sunuwar", TotalHours: 101},
                                    {Name: "Rita Alley", TotalHours: 114},
                                    {Name: "Kavvay Verma", TotalHours: 166},
                                    {Name: "Tim Perkinson", TotalHours: 176},
                                    {Name: "Mary Poppins", TotalHours: 182},
                                    {Name: "John Black", TotalHours: 205},
                                    {Name: "Stewart Malachi", TotalHours: 207},
                                    {Name: "Abhay Singh", TotalHours: 209},
                                    {Name: "Patrick Huthinson", TotalHours: 222}
                                ];
                            });
                        </script> 
                        `
                    );
                };
                var GoogleChart_tryout = () => {
                    return (
                        `
                        <div
                            id="myChart" style="width: 12cm; height: 7cm;">
                            </div>
                        <script>
                            google.charts.load("current", {"packages": ["corechart"]});
                            google.charts.setOnLoadCallback(drawChart);
                            function drawChart() {
                            var data = google.visualization.arrayToDataTable([
                                ["NAME", "TOTAL HOURS"],
                                ["Tamoy Smith", 91],
                                ["Raju Sunuwar", 101],
                                ["Rita Alley", 114],
                                ["Kavvay Verma", 166],
                                ["Tim Perkinson", 176],
                                ["Mary Poppins", 182],
                                ["John Black", 205],
                                ["Stewart Malachi", 207],
                                ["Abhay Singh", 209],
                                ["Patrick Huthinson", 222]
                            ]);
                            var options = {
                                title: "Google Pie Chart Tryout",
                                chartArea: {
                                    top: 20,
                                    left: 20,
                                    height: "90%",
                                    width: "90%"
                                },
                                is3D: true
                            };
                            var chart = new google.visualization.PieChart(document.getElementById("myChart"));
                                chart.draw(data, options);
                            }
                        </script>
                        `
                    );
                };
                return (
                    res.send(`
                        <!DOCTYPE html>
                        <html lang="en">
                            <head>
                                <meta charset="UTF-8" />
                                <meta name="viewport"
                                    content="width=device-width, initial-scale=1.0" />
                                <meta name="author"
                                    content="Dodo ==> jozef.javorsky.strom44zem88@gmail.com" />
                                <link rel="icon" type="image/x-icon" sizes="16x16"
                                    href=${__favicon_href}
                                    />
                                ${ng_table_CSS()}
                                <title>Angular Assignment</title>
                                ${ng_script()}
                                ${GoogleChart_script()}
                            </head>
                            <body style="background-color: rgb(122, 122, 122);">
                                <header></header>
                                <main>
                                    ${ng_tryout()}
                                    <br />
                                    ${GoogleChart_tryout()}
                                </main>
                                <footer></footer>
                            </body>
                        </html>
                `)
                );
            })
            .catch(function (error) {
                console.log(error);
            });
    });

    app.listen(port, () => {
        console.log(`App listening on port ${port}.`);
    });

} catch (error) {
    if (error) console.log(error);
} finally { };

