let ustawienia = {
    wysokosc: function () {
      wys = parseInt(document.getElementById("height").value);
      return wys;
    },
    szerokosc: function () {
      sze = parseInt(document.getElementById("width").value);
      return sze;
    },
    bomby: function () {
      bmb = parseInt(document.getElementById("bomb").value);
      return bmb;
    },
    tablica: function () {
      if (
        document.getElementById("bomb").value != "" &&
        document.getElementById("width").value != "" &&
        document.getElementById("height").value != ""
      ) {
        this.wysokosc();
        this.szerokosc();
        this.bomby();
        let arr = [];
        for (let i = 0; i < this.wysokosc() + 2; i++) {
          arr[i] = [];
          for (let j = 0; j < this.szerokosc() + 2; j++) {
            arr[i][j] = 0;
          }
        }
        this.rozkladanie(arr);
        this.liczenie(arr);
        this.generowanie(arr);
      } else {
        alert("Uzupełnij wszystkie pola");
      }
    },

    losowanie: function (arr) {
      celx = Math.floor(Math.random() * this.wysokosc() + 1);
      cely = Math.floor(Math.random() * this.szerokosc() + 1);
      if (arr[celx][cely] == "b") {
        this.losowanie(arr);
      } else {
        arr[celx][cely] = "b";
      }
    },
    rozkladanie: function (arr) {
      for (let i = 0; i < this.bomby(); i++) {
        this.losowanie(arr);
      }
    },

    liczenie: function (arr) {
      for (let j = 1; j < this.wysokosc() + 1; j++) {
        for (let k = 1; k < this.szerokosc() + 1; k++) {
          if (arr[j][k] != "b") {
            ilosc = 0;
            for (let m = -1; m < 2; m++) {
              for (let n = -1; n < 2; n++) {
                if (arr[j + m][k + n] == "b") {
                  ilosc = ilosc + 1;
                }
              }
            }
            arr[j][k] = ilosc;
          }
        }
      }
    },

    generowanie: function (arr) {
      document.cookie = "must=have";
      this.top();
      let cmp = document.getElementById("cmp");
      licznik = this.bomby();
      czas = 0;
      czasstartu = new Date();
      msstartu = czasstartu.getTime();
      document.getElementById("czasomierz").innerHTML = "Czas (s): " + czas;
      let liczymy = setInterval(this.liczczas, 1000);
      document.getElementById("ilosc").innerHTML = "Bomby: " + licznik;
      for (let i = 0; i < this.wysokosc() + 2; i++) {
        for (let j = 0; j < this.szerokosc() + 2; j++) {
          let div = document.createElement("div");
          div.id = i + "_" + j;
          div.classList.add("pusta");

          if (
            i != 0 &&
            i != this.wysokosc() + 1 &&
            j != 0 &&
            j != this.szerokosc() + 1
          ) {
            div.classList.add("pole");
            div.classList.add("nieklik");
            div.onclick = function () {
              ustawienia.lewy(div, arr, liczymy);
            };
            div.oncontextmenu = function () {
              ustawienia.prawy(div, arr, event, msstartu, liczymy);
            };
          }
          if (j == 0) {
            div.classList.add("koniec");
          }
          cmp.appendChild(div);
        }
      }
    },

    liczczas: function () {
      czas = czas + 1;
      document.getElementById("czasomierz").innerHTML = "Czas (s): " + czas;
    },

    lewy: function (div, arr, liczymy) {
      let wspolrzedne = div.id;
      tab = wspolrzedne.split("_");
      let wartosc = arr[tab[0]][tab[1]];
      let polozeniex = tab[0];
      let polozeniey = tab[1];
      if (wartosc == "b") {
        div.classList.remove("nieklik");
        div.classList.add("wybuch");
        ustawienia.pokaz(arr);
        this.czyszczeniepol();
        this.koniecliczenia(liczymy);
        setTimeout(function () {
          alert("Koniec gry");
        }, 100);
      } else if (wartosc == 0) {
        div.classList.remove("nieklik");
        let sp = div.classList.contains("flaga");
        if (sp == true) {
          div.classList.remove("flaga");
          licznik = licznik + 1;
          document.getElementById("ilosc").innerHTML = "Bomby: " + licznik;
        }
        let sp1 = div.classList.contains("pytajnik");
        if (sp1 == true) {
          div.classList.remove("pytajnik");
        }
        div.innerHTML = wartosc;

        ustawienia.odkrywanie(arr, polozeniex, polozeniey);
      } else {
        div.classList.remove("nieklik");
        let sp = div.classList.contains("flaga");
        if (sp == true) {
          div.classList.remove("flaga");
          licznik = licznik + 1;
          document.getElementById("ilosc").innerHTML = "Bomby: " + licznik;
        }
        let sp1 = div.classList.contains("pytajnik");
        if (sp1 == true) {
          div.classList.remove("pytajnik");
        }
        div.innerHTML = wartosc;
      }
      ustawienia.wygrana(arr, msstartu, liczymy);
    },

    odkrywanie: function (arr, polozeniex, polozeniey) {
      for (let q = -1; q < 2; q++) {
        for (let w = -1; w < 2; w++) {
          let sasiadx = parseInt(polozeniex) + q;
          let sasiady = parseInt(polozeniey) + w;

          zero = sasiadx + "_" + sasiady;
          let wybor = document.getElementById(zero);

          let wybrane = arr[sasiadx][sasiady];

          if (wybor.classList.contains("nieklik") == true) {
            let wybor = document.getElementById(sasiadx + "_" + sasiady);
            wybor.classList.remove("nieklik");
            let sp = wybor.classList.contains("flaga");
            if (sp == true) {
              wybor.classList.remove("flaga");
              licznik = licznik + 1;
              document.getElementById("ilosc").innerHTML =
                "Bomby: " + licznik;
            }
            let sp1 = wybor.classList.contains("pytajnik");
            if (sp1 == true) {
              wybor.classList.remove("pytajnik");
            }
            wybor.innerHTML = arr[sasiadx][sasiady];

            if (
              wybrane == 0 &&
              wybor.classList.contains("zerowka") == false
            ) {
              wybor.classList.add("zerowka");
            }
          }
        }
      }
      tabliczka = Array.from(document.getElementsByClassName("zerowka"));
      while (tabliczka.length != 0) {
        let wsp = tabliczka[0].id;
        tabka = wsp.split("_");
        polozeniex = tabka[0];
        polozeniey = tabka[1];
        tabliczka[0].classList.remove("zerowka");
        this.odkrywanie(arr, polozeniex, polozeniey);
        tabliczka = []; //Usuń
      }
    },

    prawy: function (div, arr, event, msstartu, liczymy) {
      event.preventDefault();
      if (
        div.classList.contains("nieklik") ||
        div.classList.contains("flaga")
      ) {
        if (
          div.classList.contains("flaga") == false &&
          div.classList.contains("pytajnik") == false
        ) {
          div.classList.add("flaga");
          div.classList.remove("nieklik");
          licznik = licznik - 1;
          document.getElementById("ilosc").innerHTML = "Bomby: " + licznik;
          ustawienia.wygrana(arr, msstartu, liczymy);
        } else if (div.classList.contains("flaga") == true) {
          div.classList.remove("flaga");
          div.classList.add("nieklik");
          licznik = licznik + 1;
          document.getElementById("ilosc").innerHTML = "Bomby: " + licznik;
          div.classList.add("pytajnik");
        } else if (div.classList.contains("pytajnik")) {
          div.classList.remove("pytajnik");
        }
      }
    },

    pokaz: function (arr) {
      for (let k = 1; k < this.wysokosc() + 1; k++) {
        for (let l = 1; l < this.szerokosc() + 1; l++) {
          co = arr[k][l];
          let pole = document.getElementById(k + "_" + l);
          if (co == "b") {
            pole.classList.add("bomba");
          }
        }
      }
    },

    wygrana: function (arr, msstartu, liczymy) {
      win = 0;
      if (licznik == 0) {
        for (let h = 1; h < this.wysokosc() + 1; h++) {
          for (let g = 1; g < this.szerokosc() + 1; g++) {
            let sprawdzajka = document.getElementById(h + "_" + g);
            if (sprawdzajka.classList.contains("nieklik") == true) {
              win = 1;
            }
          }
        }
        if (win == 0) {
          czaskoniec = new Date();
          mskoniec = czaskoniec.getTime();
          ms = mskoniec - msstartu;
          this.czyszczeniepol();
          this.koniecliczenia(liczymy);
          czaskoniec.setFullYear(9999);
          expi = czaskoniec.toUTCString();
          setTimeout(function () {
            alert("Wygrałeś");
            let nick = prompt("Podaj swój nick");
            let zakodowany = encodeURIComponent(nick);
            let ckie = document.cookie.split("; ");
            document.cookie =
              ckie.length +
              "=" +
              ustawienia.wysokosc() +
              "|" +
              ustawienia.szerokosc() +
              "|" +
              ustawienia.bomby() +
              "|" +
              ms +
              "|" +
              decodeURIComponent(zakodowany) +
              "; expires=" +
              expi +
              "; secure";
            ustawienia.top();
          }, 10);
        }
      }
    },

    top: function () {
      let mamyto =
        "<h2 id='ranksy'>Ranking w wybranym trybie gry (sec):</h2> </br> (nick)-(wynik)</br></br>";
      let coklist = document.cookie.split("; ");
      let coksmiec = coklist.findIndex(this.przeszukiwarka);
      let cokbez = coklist.splice(coksmiec, 1);
      cokbr = [];
      for (let i = 0; i < coklist.length; i++) {
        let pojedynczy = coklist[i].split("=");
        cokbr.push(pojedynczy[1]);
      }
      wym = [];
      czasy = [];
      czasinick = [];
      for (let j = 0; j < cokbr.length; j++) {
        ele = cokbr[j];
        roz = ele.split("|");
        if (parseInt(roz[0]) == ustawienia.wysokosc()) {
          if (parseInt(roz[1]) == ustawienia.szerokosc()) {
            if (parseInt(roz[2]) == ustawienia.bomby()) {
              czasy.push(roz[3]);
              wym.push(ele);
              czasinick.push(parseInt(roz[3]), roz[4]);
            }
          }
        }
      }
      best = czasy.sort(function (a, b) {
        return a - b;
      });

      if (czasy.length <= 10) {
        for (let ij = 0; ij < czasy.length; ij++) {
          czasik = best[ij];
          let indexik = czasinick.findIndex(
            (element) => element === +czasik
          );
          osobno = czasinick[indexik + 1];
          mamyto =
            mamyto +
            "</br>" +
            (ij + 1) +
            "." +
            osobno +
            "-" +
            Math.round(czasik / 1000);
          czasinick.splice(indexik, 2);
        }
        document.getElementById("ranking").innerHTML = mamyto;
      } else {
        for (let ij = 0; ij < 10; ij++) {
          czasik = best[ij];
          let indexik = czasinick.findIndex(
            (element) => element === +czasik
          );
          osobno = czasinick[indexik + 1];
          mamyto =
            mamyto +
            "</br>" +
            (ij + 1) +
            "." +
            osobno +
            "-" +
            Math.round(czasik / 1000);
          czasinick.splice(indexik, 2);
        }
        document.getElementById("ranking").innerHTML = mamyto;
      }
    },

    przeszukiwarka: function (smiec) {
      return smiec == "must=have";
    },

    czyszczeniepol: function () {
      arka = Array.from(document.getElementsByClassName("pusta"));
      document.getElementById("start").onclick = "";
      for (let oso = 0; oso < arka.length; oso++) {
        arka[oso].onclick = "";
        arka[oso].oncontextmenu = "";
      }
    },

    koniecliczenia: function (liczymy) {
      clearInterval(liczymy);
    },
  };