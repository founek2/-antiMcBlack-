/**
 * Created by martas on 2.5.17.
 */
'use strict';
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const fetch = require('node-fetch');

const ARRAY_OF_CLASSES = ["1.A","1.B","1.C","1.D","1.E","1.F","1.H","1.I","2.A","2.B","2.C","2.D","2.E","2.F","2.G","2.H","3.A","3.B","3.C","3.D","3.E","3.F","4.A","4.B","4.C","4.D","4.E","4.F","4.G"]

let Main = function () {
    //object data of time-table
    this.main = {};
    /** object pro vyparsovaný supl**/
    this.original = {};
    /** object rozvrhy**/
    this.origCopy = {};
    /** kopie rozvrhu do které se promítají změny suplu**/
    this.suplDates = [];
    /** datumy pro dny suplování **/
    this.hours;
    /** pole pro začátek a konec hodiny **/
    this.cerDate;
    /** Černochův date**/
    this.date;
    this.init();
    /** spuštění parseru v konstruktoru **/

};
/** inicializační fce, spustí stažení suplu, potom zavolá downTimeTable - stáhne rozvrhy jednotlivým třídám a nakonec spustí kombinaci **/
Main.prototype.init = function () {
    let self = this;
    let date = new Date();
    let numberOfDay = date.getDay() - 1;
    if (numberOfDay > 4 || numberOfDay === -1) {
        numberOfDay = 0;
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1 + (numberOfDay === -1 ? -1 : 0))
    }

    this.date = date;
    date = date.getFullYear().toString().substring(2, 4) + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + (date.getDate() > 9 ? date.getDate() : ("0" + date.getDate()));
    /** date podle Černochova co je na suplu**/
    self.cerDate = date;


    //download supl
    console.log("downloading supl...");

    /** stažení html a vytvoření virtuálního DOM **/
    JSDOM.fromURL("https://supl.spse.cz/suplobec.htm").then(dom => {

        /** stažení rozvrhů jednotlivých tříd z Černochova API**/
        this.downTimeTable(self.parser(dom.window)).then((result) => {
            //     console.log(JSON.stringify(self.original));
            console.log(result);
            self.origCopy = JSON.parse(JSON.stringify(self.original));
            /** vytvoření kopie rozvrhů se kterým se zkombinuje supl **/
            //self.origCopy = JSON.parse(JSON.stringify(self.original));
            // self.original2 = JSON.parse(JSON.stringify(self.original));
            self.combination();
        })
            .catch(err => {
                console.log(err);
            })

    }).catch(function (err) {
        console.log(err)
    });
};

Main.prototype.parser = function (win) {
    let arrayTables = [];
    let classes = ARRAY_OF_CLASSES;

    console.log("parser");

    /** vybrání všech tabulek na stránce **/
    let tables = win.document.querySelectorAll("table");

    for (let i = 0; i < tables.length; i++) {
        /** Nalezení tabulek s nadpisem **/
        if (tables[i].rows[0].cells[0].textContent.trim() == "Změny v rozvrzích tříd:") {
            arrayTables.push(tables[i]);
        }

    }
    /** pole tabulek se změnami pro třídy **/
    tables = arrayTables;

    //searching tables
    let number = 0;
    for (let tabl = 0; tabl < tables.length; tabl++) {
        /** procházení jednotlivých tabulek **/
        let date = win.document.querySelectorAll('a')[number].name.substring(2, 8);
        /** vybrání datumu ze stránky v elementu a**/
        number++;
        this.main[date] = {};
        /** inicializace objectu s datumem jako key **/
        this.suplDates.push(new Date("20" + date.slice(0, 2), Number(date.slice(2, 4)) - 1, date.slice(4, 6)));


        let currHour;

        /** prrocházení řádků tabulky **/
        for (let row = 1; row < tables[tabl].rows.length; row++) {
            let currRow = tables[tabl].rows[row];

            //search class
            /** tato podmínka projde když v první buňce na řádku něco je = je tam třída **/
            if (currRow.cells[0].childNodes[0].innerHTML != undefined) {
                var clas = currRow.cells[0].childNodes[0].innerHTML.trim();
                if (classes.indexOf(clas) === -1) {
                    /** když ji ještě nemám v poli tak si ji tam přidám (pouze kontrola kdyby se v suplu vyskytnula stejná třída 2x)**/
                    classes.push(clas);
                }

                this.main[date][clas] = [];
            }

            //search hours

            if (currRow.cells[1].childNodes[0].innerHTML) {
                /** projde pokud je ve 2. buňce něco = číslo hodiny**/
                currHour = currRow.cells[1].childNodes[0].innerHTML;
                currHour = currHour.replace(/\D/g, '');
                /** odstraní vše kromě čísla (1.hod převede na 1) **/

                let a = {};
                a[currHour] = [];
                this.main[date][clas].push(a);
            }

            /** přidá do pole změnu **/
            this.main[date][clas][(this.main[date][clas].length - 1)][currHour].push({
                subject: currRow.cells[2].childNodes[0].innerHTML,
                group: currRow.cells[3].childNodes[0].innerHTML === undefined ? currRow.cells[3].childNodes[0].innerHTML : currRow.cells[3].childNodes[0].innerHTML.replace(/^\D+/g, ''),
                room: currRow.cells[4].childNodes[0].innerHTML,
                change: currRow.cells[5].childNodes[0].innerHTML.replace("&lt;&lt;", "<<").replace("&gt;&gt;", ">>"),
                /** nahrazení asi unicode za znaky **/
                teacher: currRow.cells[6].childNodes[0].innerHTML,
                other: currRow.cells[7].childNodes[0].innerHTML
            });

        }
    }
    //  console.log(classes);
    // console.log(JSON.stringify(this.main));

    return classes
}

Main.prototype.downTimeTable = function (array) {
    let self = this;
    let index = 0;
    let counter = 0;
    let ErrorCounter = 0;
    let arrayProm = [];
    array = array.sort();
    let first = true;

    console.log("downloading time-tables for classses...");

    /** pro stažení rozvrhů jednotlivých tříd používám pole promise abych si byl jist že se stáhly všechny,
     *  nakonec když se vše resolvne tak dám resolve Promise kterou vracím **/
    return new Promise((resolve, reject) => {
        if (array.length) {

            /** interval je použit z důvodu blokace častých requestu na API, je třeba vždy min cca 200ms čekat **/
            let timer = setInterval(function () {
                let object = {
                    cmd: "get",
                    data: {id: array[index], date: (new Date).getTime()}
                };
                //   console.log(array[index]);
                arrayProm.push(fetch('https://rozvrh.spse.cz/index.php', {
                    method: 'POST',
                    body: JSON.stringify(object)
                })
                    .then(function (res) {
                        return res.json();
                    }).then(function (json) {
                        if (json != "Data nejsou k dispozici" && json) {
                            if (first) {
                                /** uložení objektu hours ve kterém jsou kdy začínají a končí jednotlivé hodiny **/
                                self.hours = json.hours;
                                !first;
                            }
                            /** odebrání zbytečních dat **/
                            delete json.order;
                            delete json.hours;
                            counter++;
                            return json;
                           // self.original[array[counter]] = json;

                        }

                    }).catch(function (err) {
                        console.log(ErrorCounter++)
                    }));

                if (index === (array.length - 1)) {
                    clearInterval(timer)
                    Promise.all(arrayProm).then(function (values) {
                        array.forEach(function (item, i) {
                            self.original[array[i]] = values[i]; /** uložení rozvrhů do objectu, klíč je třída**/
                        });
                        /** když je vše resolve tak se resolvne promise kteoru vrací tato methoda **/
                        resolve({errors: ErrorCounter, index: index});
                    });
                }
                index++
            }, 400)
        } else {
            /** pokud se nic nestahuje **/
            resolve()
        }

    })
};


Main.prototype.combination = function () {
    let original = this.original;
    let origCopy = this.origCopy;
    let main = this.main;
    let suplDates = this.suplDates;
    let arrayOfSuplDays = [];
    const productionMode = process.env.NODE_ENV === 'production';
    
    suplDates.forEach(function (date) {
        arrayOfSuplDays.push(new Date(date).getDay() - 1);
    });

    for (let clas in origCopy) {
        let clasItems = origCopy[clas].items;
        clasItems.forEach(function (item, i) {
            if (arrayOfSuplDays.indexOf(i) === -1) {
                clasItems[i] = {};
                /** odstranění z kopie normální dny bez suplování, protože ty jsou v originálu > zbytečně by byly data duplicitní**/
            }
        })

    }

    /** prochazeni dnu suplu **/
    for (let day in main) {

        /** prochazeni objectu dnů v supl**/
        let accDay = new Date(20 + day.slice(0, 2), day.slice(2, 4) - 1, day.slice(4, 8)).getDay() - 1;
        /** získání aktuálního data, které využívá Černoch na suplu**/
        for (let clas in main[day]) {
            if (!productionMode) console.log("clas", clas);
            let records = main[day][clas];
            let week = (this.getWeekNumber() % 2) === 0 ? "S: " : "L: ";
            /** získání jestli je týden sudý nebo lichý **/

            /** prochazeni pole tříd v supl**/
            for (let index = 0; index < records.length; index++) {

                /** procházení jednotlivých hodin v supl **/
                for (let hour in records[index]) {
                    if (!productionMode) console.log(hour);

                    /** když existuje object pro třídu ze supl v objectu s rozvrhy (ne všechny třídy mají rozvrh např. VOŠ, ale mají supl) **/
                    if (original[clas]) {
                        if(!original[clas].items[accDay]) original[clas].items[accDay] = [];
                        let origHour = original[clas].items[accDay][hour];
                        if(!origCopy[clas].items[accDay]) origCopy[clas].items[accDay] = [];
                        let origHourCopy = origCopy[clas].items[accDay][hour];
                        let record = records[index][hour];
                        //  console.log("record", record)

                        /** procházení pole dané hodiny např. 1h má pole s rozvrhem pro skupinu 1 a 2 **/
                        for (let i = 0; i < record.length; i++) {
                            if (origHour) { /** pokud existuje daná hodina v rozvrhu **/
                                for (let j = 0; j < origHour.length; j++) {
                                    if (record[i].change === "přesun >>" && !origHourCopy[j].change) {
                                        /** !change z důvodu že se tam mohla promítnout změna ze suplu a pro tridu je vzdy jen jeden zaznam**/
                                        if(record[i].group){
                                            if (origHour[j].group === ('(' + record[i].group + ')')){
                                                origHourCopy[j].change = "odpadá";
                                                break;
                                            }
                                        }else {
                                            origHourCopy[j].change = "odpadá";
                                            break;
                                        }
                                        /** nic kromě změny se nemění **/
                                    }
                                    if (record[i].change === "supluje" || record[i].change === "změna" || record[i].change === "výměna <<" || record[i].change === "přesun <<" || record[i].change === "supluje" || record[i].change === "spojí" || record[i].change === "odpadá" || record[i].change === "navíc") {

                                        /** v této podmínce se kontrolují aby souhlasily skupiny, souběžně se prochází pole se skupinami v suplu a rozvrhu > hledá se shoda
                                         * jinak podmínky mluví sami za sebe vždy kontrola nějaké změny a následná úprava objectu v copii obectu originálního rozvrhu**/
                                        if (record[i].group) {
                                            if (record[i].change === "navíc") {
                                                origHourCopy.push({
                                                    teacher: record[i].teacher,
                                                    group: "(" + record[i].group + ")",
                                                    subject: record[i].subject,
                                                    room: record[i].room,
                                                    change: record[i].change
                                                })
                                                if (!productionMode) console.log("navic skupina");
                                                break
                                            } else if (origHour[j].group === ('(' + record[i].group + ')')) {

                                                if (origHour[j].week) {
                                                    if (origHour[j].week === week) {

                                                        origHourCopy[j] = {
                                                            week: week,
                                                            teacher: record[i].teacher,
                                                            group: "(" + record[i].group + ")",
                                                            subject: record[i].subject,
                                                            room: record[i].room,
                                                            change: record[i].change
                                                        };
                                                        if (!productionMode) console.log("change skupina");
                                                    }
                                                } else {
                                                    origHourCopy[j] = {
                                                        week: undefined,
                                                        teacher: record[i].teacher,
                                                        group: "(" + record[i].group + ")",
                                                        subject: record[i].subject,
                                                        room: record[i].room,
                                                        change: record[i].change
                                                    };

                                                    if (!productionMode) console.log("change skupina");
                                                }
                                            }
                                        } else {
                                            if (record[i].change === "navíc") {
                                                origHourCopy.push({
                                                    teacher: record[i].teacher,
                                                    subject: record[i].subject,
                                                    room: record[i].room,
                                                    change: record[i].change
                                                })
                                                if (!productionMode) console.log("navíc trida")
                                                break
                                            } else if (origHour[j].week) {
                                                if (origHour[j].week === week) {
                                                    origHourCopy[j] = {
                                                        week: week,
                                                        teacher: record[i].teacher,
                                                        subject: record[i].subject,
                                                        room: record[i].room,
                                                        change: record[i].change
                                                    };
                                                }
                                            } else if (record[i].change === "presun <<") {
                                                origHourCopy[j] = {
                                                    week: week,
                                                    teacher: record[i].teacher,
                                                    subject: record[i].subject,
                                                    room: record[i].room,
                                                    change: record[i].change
                                                };
                                                if (!productionMode) console.log("přesun třída")
                                            } else {
                                                origHourCopy[j] = {
                                                    week: undefined,
                                                    teacher: record[i].teacher,
                                                    subject: record[i].subject,
                                                    room: record[i].room,
                                                    change: record[i].change
                                                }
                                            }
                                            if (!productionMode) console.log("change trida")
                                        }

                                    } else {
                                        //    console.log("vyjimka", clas, hour, record[i].change, JSON.stringify(origHour))
                                    }
                                }

                            } else if (record[i].change === "přesun <<" || record[i].change === "navíc") {
                                /** v tomto případě v rozvrhu hodina neexistuje **/
                                origCopy[clas].items[accDay][hour] = [];

                                origCopy[clas].items[accDay][hour].push({
                                    week: "",
                                    teacher: record[i].teacher,
                                    group: record[i].group ? "(" + record[i].group + ")" : "",
                                    subject: record[i].subject,
                                    room: record[i].room,
                                    change: record[i].change
                                });
                                //  console.log("change trida presun")
                            }
                        }

                    }

                }
            }

        }
    }
    console.log("combined")
    if (!productionMode) {
        console.log(JSON.stringify(this.origCopy))
        console.log(JSON.stringify(this.original))
        console.log(JSON.stringify(this.main))
    }
}

/** pomocná fce pro získání sudého nebo lichého týdnu **/
Main.prototype.getWeekNumber = function () {
    let d = this.date;
    d.setHours(0, 0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    return weekNo;
}

const getWeekNumber = function (date) {
    let d = new Date(date);
    d.setHours(0, 0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    return weekNo;
}

module.exports = Main