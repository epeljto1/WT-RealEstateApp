const MarketingAjax = (() => {
    let pom = [];
    let pom2 = [];
    let izvrseno = false;
    let izvrseno2 = false;
    function impl_osvjeziPretrage(divNekretnine)
    {
        setInterval(function() {let xhttp = new XMLHttpRequest();

        const reqData = {nizNekretnina:pom};
        xhttp.open("POST","http://localhost:3000/marketing/osvjezi",true);
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState == 4 && xhttp.status==200)
            {
                const data = JSON.parse(xhttp.responseText);  
                const nekretnine = data.nizNekretnina;
                nekretnine.forEach(nekretnina => {
                    const divId = `pretrage-${nekretnina.id}`;
                    const pretrageDiv = divNekretnine.querySelector(`#${divId}`);
                    if(pretrageDiv) pretrageDiv.textContent = `PRETRAGE: ${nekretnina.pretrage}`;
                })
            }
            else
            {
                const pretrage = divNekretnine.querySelectorAll('div[id^="pretrage"]');
                pretrage.forEach(div => {
                    div.style.display = 'none';
                });
            }
        }
        if(izvrseno) {
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(reqData)); 
        }
        else {xhttp.send();}
        izvrseno = false;
    
    },500);
    }

    function impl_osvjeziKlikove(divNekretnine)
    {
        setInterval(function(){
            let xhttp = new XMLHttpRequest();
            const reqData = {nizNekretnina:pom2};
            xhttp.open("POST","http://localhost:3000/marketing/osvjezi",true);
            xhttp.onreadystatechange = function()
            {
                if(xhttp.readyState == 4 && xhttp.status==200)
                {
                    const data = JSON.parse(xhttp.responseText);  
                    const nekretnine = data.nizNekretnina;
                    nekretnine.forEach(nekretnina => {
                        const divId = `klikovi-${nekretnina.id}`;
                        const klikoviDiv = divNekretnine.querySelector(`#${divId}`);
                        if(klikoviDiv) klikoviDiv.textContent = `KLIKOVI: ${nekretnina.klikovi}`;
                    })
                }
                else
                {
                    const klikovi = divNekretnine.querySelectorAll('div[id^="klikovi"]');
                    klikovi.forEach(div => {
                        div.style.display = 'none';
                    });
                }
            }
            if(izvrseno2) {
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(reqData)); 
            }
            else {xhttp.send();}
            izvrseno2 = false;
        },500)
    }

    function impl_novoFiltriranje(listaFiltriranihNekretnina)
    {
        const ids = listaFiltriranihNekretnina.map(obj => obj.id);
        pom = [...ids];
        izvrseno = true;
        const reqData = {nizNekretnina:ids};
        let xhttp = new XMLHttpRequest();

        xhttp.open("POST","http://localhost:3000/marketing/nekretnine",true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(reqData));
    }

    function impl_klikNekretnina(idNekretnine)
    {
        pom2[0] = idNekretnine;
        izvrseno2 = true;
        let xhttp = new XMLHttpRequest();

        xhttp.open("POST","http://localhost:3000/marketing/nekretnine/"+idNekretnine,true);
        xhttp.send();
    }

    return {
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
        novoFiltriranje: impl_novoFiltriranje,
        klikNekretnina: impl_klikNekretnina
    }

})();