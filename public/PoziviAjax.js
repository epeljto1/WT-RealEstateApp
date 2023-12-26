const PoziviAjax = (() => {

    function impl_getKorisnik(fnCallback) {
        let xhttp = new XMLHttpRequest();

        xhttp.open("GET","http://localhost:3000/korisnik",true);
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState==4 && xhttp.status==200)
            {
                const data = JSON.parse(xhttp.responseText);
                fnCallback(null,data);
                updateMeni(true);
            }
            else if(xhttp.status==4){
                const error = JSON.parse(xhttp.responseText);
                fnCallback(error,null);
            }
        }
        xhttp.send();  
    }

    function impl_putKorisnik(noviPodaci, fnCallback)
    {
        let xhttp = new XMLHttpRequest();

        xhttp.open("PUT","http://localhost:3000/korisnik",true);
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState==4 && xhttp.status==200)
            {
                const data = JSON.parse(xhttp.responseText);
                fnCallback(null,data);
                updateMeni(true);
            }
            else if(xhttp.status==4){
                const error = JSON.parse(xhttp.responseText);
                fnCallback(error,null);
            }
        }
        xhttp.send(JSON.stringify(noviPodaci));
    }

    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback)
    {
        let xhttp = new XMLHttpRequest();

        xhttp.open("POST","http://localhost:3000/upit",true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState==4 && xhttp.status==200)
            {
                const data = JSON.parse(xhttp.responseText);
                fnCallback(null,data);
            }
            else if (xhttp.readyState==4)
            {
                const error = JSON.parse(xhttp.responseText);
                fnCallback(error,null);
            }
        }
        xhttp.send("nekretnina_id="+nekretnina_id+"&tekst_upita="+tekst_upita);
    }

    function impl_getNekretnine(fnCallback)
    {
        let xhttp = new XMLHttpRequest();

        xhttp.open("GET","http://localhost:3000/nekretnine",true);
        
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState==4 && xhttp.status==200)
            {
                const data = JSON.parse(xhttp.responseText);
                fnCallback(null,data);
            }
            else if (xhttp.readyState==4)
            {
                const error = JSON.parse(xhttp.responseText);
                fnCallback(error,null);
            }
        }
        xhttp.send();
    }

    function impl_postLogin(username, password,fnCallback) {
        let xhttp = new XMLHttpRequest();
    
        xhttp.open("POST","http://localhost:3000/login",true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState==4 && xhttp.status==200)
            {
                const data = JSON.parse(xhttp.responseText);
                fnCallback(null,data);
                window.location.href="http://localhost:3000/nekretnine.html";
            }
            else if(xhttp.readyState==4){
                const error = JSON.parse(xhttp.responseText);
                fnCallback(error,null);
            }
        }
        xhttp.send("username="+username+"&password="+password);
    }

    function impl_postLogout(fnCallback)
    {
        let xhttp = new XMLHttpRequest();

        xhttp.open("POST","http://localhost:3000/logout",true);
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState==4 && xhttp.status==200)
            {
                const data = JSON.parse(xhttp.responseText);
                fnCallback(null,data);
                vratiMeni(true);
            }
            else if(xhttp.readyState==4)
            {
                const error = JSON.parse(xhttp.responseText);
                fnCallback(error,null);
            }
        }
        xhttp.send();
    }

    function updateMeni(login)
    {
        const prijava = document.getElementById("prijava");
        const profil = document.getElementById("profil");
        if(login && prijava && profil) {
        prijava.innerHTML = '<a>Odjava</a>';
        profil.style.display = 'inline';
        }
    }

    function vratiMeni(logout)
    {
        const odjava = document.getElementById("prijava");
        const profil = document.getElementById("profil");
        if(logout && odjava && profil)
        {
          odjava.innerHTML = '<a href="prijava.html" target="_blank">Prijava</a>';
          profil.style.display = 'none';
        }
    }

    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine
    };
})();