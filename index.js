let tBody = document.querySelector("table tbody");

let tHead = document.querySelectorAll("table thead tr td");
getCovidItems();
let covitItems = [];

let sercher = document.querySelector(".sercher");

const loader = {
  load: false,
};

async function getCovidItems() {
  try {
    await fetch(`https://corona-api.com/countries`)
      .then((data) => data.json())
      .then(({ data }) => {
        loader.load = true;
        drowCovidItems(data);
      });
  } catch (e) {
    console.log(e);
  }
}

let div = document.createElement("div");

div.classList.add("inLoading");

document.querySelector(".main__block").prepend(div);

function drowCovidItems(arr) {
  tBody.innerHTML = " ";
  let newArr = [];

  arr.reduce((aggr, value) => {
    newArr.includes(value) ? aggr : newArr.push(value);
    return aggr;
  }, []);

  loader.load && div.classList.add("loadOver"),
    div.classList.remove("inLoading");

  covitItems.push(...newArr);

  let totlaConfirmed = newArr.reduce(
    (aggr, value) => value.latest_data.confirmed + aggr,
    0
  );
  let totlaDead = newArr.reduce(
    (aggr, value) => value.latest_data.deaths + aggr,
    0
  );

  console.log(totlaConfirmed);
  console.log(totlaDead);

  arr.forEach((element, i) => {
    let tr = document.createElement("tr");
    let tdN = document.createElement("td");
    let tdCountry = document.createElement("td");
    let tdConfirmed = document.createElement("td");
    let tdDead = document.createElement("td");
    let tdCritical = document.createElement("td");
    let tdRecoverd = document.createElement("td");

    tdN.innerText = i;
    tdCountry.innerText = element.name;
    tdConfirmed.innerText = element.today.confirmed;
    tdDead.innerText = element.today.deaths;
    tdDead.classList.add("color");
    tdCritical.innerText = element.latest_data.critical;
    tdCritical.classList.add("critical");

    tdRecoverd.innerText = element.latest_data.recovered;
    tdRecoverd.classList.add("recoverd");

    tr.append(tdN, tdCountry, tdConfirmed, tdDead, tdCritical, tdRecoverd);

    tBody.appendChild(tr);
  });
}

tHead.forEach((element) => {
  element.addEventListener("click", sortsCovidItem);
});

let reverse = {
  N: true,
  Country: true,
  todayConfirmed: true,
  todayDead: true,
  critical: true,
  recoverd: true,
};

function sortKeys(key) {
  const set = new Set(covitItems);

  let fakeArr = [...set];
  let allItems = fakeArr
    .reduce((aggr, value) => {
      aggr.push(value[key]);
      return aggr;
    }, [])
    .sort();

  let result = allItems.reduce((aggr, value) => {
    let index = fakeArr.findIndex((i) => i[key] === value);
    if (index > -1) {
      aggr.push(fakeArr[index]);
    }
    return aggr;
  }, []);

  return result;
}

function numSorts(key) {
  const set = new Set(covitItems);

  let fakeArr = [...set];

  let reduceArr = fakeArr
    .reduce((aggr, value) => {
      aggr.push(value[key].confirmed);
      return aggr;
    }, [])
    .sort((a, b) => a - b);

  let result = reduceArr.reduce((aggr, value) => {
    let index = fakeArr.findIndex((i) => i[key].confirmed === value);
    if (index > -1) {
      aggr.push(fakeArr[index]);
      fakeArr.splice(index, 1);
    }
    return aggr;
  }, []);

  return result;
}

function numSorts2(key) {
  let fakeArr = [...new Set(covitItems)];

  let reduceArr = fakeArr
    .reduce((aggr, value) => {
      aggr.push(value[key].deaths);
      return aggr;
    }, [])
    .sort((a, b) => a - b);

  let result = reduceArr.reduce((aggr, value) => {
    let index = fakeArr.findIndex((i) => i[key].deaths === value);
    if (index > -1) {
      aggr.push(fakeArr[index]);
      fakeArr.splice(index, 1);
    }
    return aggr;
  }, []);

  return result;
}

sercher.addEventListener("input", serchItem);

function serchItem(e) {
  let set = [...new Set(covitItems)];

  let filters = set.filter((element) => {
    return element.name.toLowerCase().startsWith(e.target.value.toLowerCase());
  });

  drowCovidItems(filters);
}

function sortsCovidItem(e) {
  switch (e.target.innerText) {
    case "Country":
      if (reverse.Country) {
        drowCovidItems(sortKeys("name"));

        reverse.Country = false;
      } else {
        drowCovidItems(sortKeys("name").reverse());
        reverse.Country = true;
      }

      break;
    case "today confirmed": {
      if (reverse.todayConfirmed) {
        drowCovidItems(numSorts("today"));
        reverse.todayConfirmed = false;
      } else {
        drowCovidItems(numSorts("today").reverse());
        reverse.todayConfirmed = true;
      }
    }
    case "today dead": {
      if (reverse.todayDead) {
        drowCovidItems(numSorts2("today"));
        reverse.todayDead = false;
      } else {
        drowCovidItems(numSorts2("today").reverse());
        reverse.todayDead = true;
      }
    }

    default:
      break;
  }
}
