import ViewPermissionsModal from "../components/dashboard/content/UserManagement/ViewPermissionsModal";


export const bs = {
    // Common
    common: {
        loading: 'Učitavanje...',
        error: 'Greška',
        removal: 'Uklanjanje',
        setAsDefault: 'Postavi kao zadano',
        default: 'Zadano',
        saving: 'Učitavanje...',
        success: 'Uspjeh',
        cancel: 'Otkaži',
        select: 'Odaberi',
        change: 'Promijeni',
        save: 'Sačuvaj',
        delete: 'Izbriši',
        edit: 'Uredi',
        "emailAddress": "Email Adresa",
        "emailPlaceholder": "ti@primjer.com",
        add: 'Dodaj',
        search: 'Pretraži',
        filter: 'Filtriraj',
        close: 'Zatvori',
        open: 'Otvori',
        yes: 'Da',
        no: 'Ne',
        next: 'Sljedeće',
        previous: 'Prethodno',
        continue: 'Nastavi',
        refresh: 'Osvježi',
        clear: 'Očisti',
        filters: 'Filteri',
        allStatuses: 'Svi Statusi',
        pending: 'Na čekanju',
        delivered: 'Isporučeno',
        cancelled: 'Otkazano',
        dateRange: 'Vremenski Raspon',
        today: 'Danas',
        yesterday: 'Juče',
        last7Days: 'Zadnjih 7 dana',
        last30Days: 'Zadnjih 30 dana',
        thisMonth: 'Ovaj mjesec',
        lastMonth: 'Prošli mjesec',
        retry: 'Pokušaj ponovo',
        remove: 'Ukloni',
        dismiss: 'Odbaci',
        download: 'Preuzmi'
    },
    filter: {
        "status": "Status",
        "all": "Sve",
        "allergen": "Alergen",
        "active": "Aktivno",
        "inactive": "Neaktivno",
        "categories": "Kategorije",
        allergenic: "alergeno",
        nonallergenic: "bez alergena",
        specific: {
            allergens: "alergeni"
        },
        "price": {
            "range": "Raspon Cijena",
            "min": "Min Cijena",
            "max": "Max Cijena"
        }
    },
    sort: {
        "title": "Sortiraj Po",
        "name": {
            "asc": "Ime (A-Z)",
            "desc": "Ime (Z-A)"
        },
        "status": {
            "label": "Status",
            "asc": "Status (A-Z)",
            "desc": "Status (Z-A)"
        },
        "allergen": {
            "label": "Alergen",
            "asc": "Alergen (A-Z)",
            "desc": "Alergen (Z-A)"
        },
        "price": {
            "asc": "Cijena (Niska ka Visokoj)",
            "desc": "Cijena (Visoka ka Niskoj)"
        },
        "order": {
            "asc": "Redoslijed Prikaza (Prvi do Zadnjeg)",
            "desc": "Redoslijed Prikaza (Zadnji do Prvog)"
        },
        "created": {
            "asc": "Datum Kreiranja (Prvo Najstarije)",
            "desc": "Datum Kreiranja (Prvo Najnovije)"
        }
    },
    clear: {
        "filters": "Očisti Filtere",
        "all": "Očisti Sve"
    },
    restaurantManagement: {
        tabs: {
            general: "Opšte",
            legal: "Pravno",
            about: "O nama",
        },
        GeneralInformation: "Opšte Informacije",
        restaurantLogo: ""
    },
    // Navigation
    nav: {
        home: 'Početna',
        features: 'Karakteristike',
        pricing: 'Cijene',
        testimonials: 'Svjedočanstva',
        faq: 'Česta Pitanja',
        contact: 'Kontakt',
        login: 'Prijava',
        register: 'Registracija',
        logout: 'Odjava',
        profile: 'Profil',
        settings: 'Postavke',
        dashboard: 'Kontrolna tabla',
        goToPanel: 'Idi na Panel'
    },

    // Auth
    auth: {
        login: 'Prijava',
        register: 'Registracija',
        logout: 'Odjava',
        email: 'Email',
        password: 'Lozinka',
        confirmPassword: 'Potvrdi Lozinku',
        forgotPassword: 'Zaboravljena Lozinka',
        rememberMe: 'Zapamti Me',
        alreadyHaveAccount: 'Već imate nalog?',
        dontHaveAccount: 'Nemate nalog?',
        signIn: 'Prijavi se',
        signUp: 'Registruj se'
    },

    hero: {
        title: {
            line1: 'Digitalizujte Svoj',
            line2: 'Restoran',
            line3: 'uz QR Meni'
        },
        subtitle: 'Vaši kupci mogu trenutno pristupiti vašem meniju skeniranjem QR koda. Ponudite beskontaktno, brzo i moderno iskustvo.',
        features: {
            qrAccess: 'Brz Pristup uz QR Kod',
            mobileOptimized: 'Mobilna Optimizacija',
            instantUpdate: 'Trenutno Ažuriranje'
        },
        cta: {
            getStarted: 'Započnite',
            features: 'Karakteristike'
        },
        socialProof: {
            restaurants: '500+ Sretnih Restorana',
            satisfaction: '99% Zadovoljstvo Kupaca'
        },
        mockup: {
            restaurantName: 'iDIGITEK',
            scanPrompt: 'Skenirajte QR kod za pregled menija',
            pizza: 'Margarita Pizza',
            salad: 'Cezar Salata',
            dessert: 'Tiramisu'
        }
    },

    // Dashboard Navigation
    dashboard: {
        overview: {
            title: 'Pregled',
            description: 'Pogledajte finansijski i operativni status vašeg restorana.',
            loading: 'Učitavanje podataka kontrolne table...',
            refresh: 'Osvježi',
            errorTitle: 'Neuspjelo učitavanje podataka kontrolne table',
            kpis: {
                totalViews: 'Ukupno Pregleda',
                qrScans: 'QR Skeniranja',
                totalOrders: 'Ukupno Narudžbi',
                customerRating: 'Ocjena Kupaca',
                todaySales: 'Današnja Prodaja',
                currentBalance: 'Trenutni Saldo',
                weekRevenue: 'Sedmični Prihod',
                monthRevenue: 'Mjesečni Prihod',
                avgOrderValue: 'Prosj. Vrijednost Narudžbe',
                totalShifts: 'Ukupno Smjena',
                changeTexts: {
                    lastWeek: 'vs Prošla Sedmica',
                    lastMonth: 'vs Prošli Mjesec',
                    thisWeek: 'Ova Sedmica',
                    today: 'Danas'
                }
            },
            quickStats: {
                thisMonth: 'Ovaj Mjesec',
                totalOrders: 'Ukupno Narudžbi',
                average: 'Prosjek',
                dailyOrders: 'Dnevne Narudžbe',
                new: 'Novi',
                customers: 'Kupci',
                rating: 'Ocjena',
                totalCount: 'Ukupan Broj',
                cashSales: 'Gotovinska Prodaja',
                cardSales: 'Kartična Prodaja',
                status: 'Status',
                open: 'Otvoreno',
                closed: 'Zatvoreno'
            },
            charts: {
                weeklyActivity: 'Sedmična Aktivnost',
                popularProducts: 'Popularni Proizvodi',
                monthlyRevenue: 'Mjesečni Prihod',
                paymentMethods: 'Načini Plaćanja',
                revenueComparison: 'Poređenje Prihoda',
                noData: 'Nema dostupnih podataka'
            }
        },
        branches: {
            title: 'Upravljanje Filijalama',
            description: 'Upravljajte svojim filijalama i dodajte nove.',
            error: {
                loadFailed: 'Neuspjelo učitavanje filijala',
                createFailed: 'Neuspjelo kreiranje filijale',
                updateFailed: 'Neuspjelo ažuriranje filijale',
                deleteFailed: 'Neuspjelo brisanje filijale',
                statusUpdateFailed: 'Neuspjelo ažuriranje statusa filijale',
                detailsLoadFailed: 'Neuspjelo učitavanje detalja filijale',
                restaurantIdNotFound: 'ID restorana nije pronađen'
            },
            delete: {
                title: 'Izbriši Filijalu',
                confirmMessage: 'Jeste li sigurni da želite izbrisati filijalu? Ova radnja se ne može poništiti.'
            }
        },
        orders: {
            title: 'Narudžbe',
            description: 'Pregledajte i upravljajte narudžbama.',
            loading: 'Učitavanje narudžbi...',
            refresh: 'Osvježi',
            newOrder: 'Nova Narudžba',
            selectBranch: "Odaberi Filijalu",
            selectBranchToView: "Odaberi Filijalu za Pregled",
            noBranches: "Nema Filijala",
            tabs: {
                all: 'Sve',
                pending: 'Na čekanju',
                preparing: 'U pripremi',
                ready: 'Spremno',
                delivered: 'Isporučeno',
                cancelled: 'Otkazano'
            },
            status: {
                pending: 'Na čekanju',
                preparing: 'U pripremi',
                ready: 'Spremno',
                delivered: 'Isporučeno',
                cancelled: 'Otkazano'
            },
            stats: {
                totalOrders: 'Ukupno Narudžbi',
                totalRevenue: 'Ukupan Prihod',
                pendingOrders: 'Narudžbe na čekanju',
                avgOrderValue: 'Prosječna Vrijednost Narudžbe'
            }
        },
        orderType: {
            title: "Postavke Tipa Narudžbe",
            requiresName: "Zahtijeva Ime Kupca",
            requiresTable: "Zahtijeva Odabir Stola",
            requiresAddress: "Zahtijeva Adresu",
            requiresPhone: "Zahtijeva Broj Telefona",
            estimatedMinutes: "Procijenjene Minute",
            subtitle: "Upravljajte statusom aktivacije, minimalnim iznosom narudžbe i naknadama za uslugu za tipove narudžbi",
            loading: "Učitavanje tipova narudžbi...",
            pleaseWait: "Molimo sačekajte",
            settingsUpdated: "postavke uspješno ažurirane",
            updateError: "Došlo je do greške pri ažuriranju postavki",
            loadingError: "Došlo je do greške pri učitavanju tipova narudžbi",
            active: "aktivno",
            minutes: "minuta",
            requirements: "Zahtjevi",
            table: "Stol",
            address: "Adresa",
            phone: "Telefon",
            activeStatus: "Status Aktivnosti",
            activeStatusDescription: "Omogući/onemogući ovaj tip narudžbe",
            minOrderAmount: "Minimalni Iznos Narudžbe",
            serviceCharge: "Naknada za Uslugu",
            saveSettings: "Sačuvaj Postavke",
            updating: "Ažuriranje...",
            totalOrderTypes: "Ukupno Tipova Narudžbi",
            activeTypes: "Aktivni Tipovi",
            totalActiveOrders: "Ukupno Aktivnih Narudžbi",
            estimatedTime: "Procijenjeno Vrijeme"
        },
        moneyCase: {
            title: "Upravljanje Kasom"
        },
        products: {
            title: 'Proizvodi',
            description: 'Pregledajte i upravljajte svojim proizvodima.'
        },
        ingredients: {
            title: "Sastojci"
        },
        extras: {
            title: "Dodaci",
        },
        tables: {
            title: 'Upravljanje Stolovima',
            description: 'Operacije upravljanja stolovima.',
            loading: 'Učitavanje stolova...',
            selectBranch: 'Molimo odaberite filijalu za upravljanje stolovima',
            noCategories: 'Još nema kategorija stolova u ovoj filijali',
            tableCount: 'stolova',
            newTable: 'Dodaj Novi Stol'
        },
        users: {
            title: 'Upravljanje Korisnicima',
            description: 'Upravljajte korisnicima, ulogama i dozvolama.',
            loading: 'Učitavanje korisnika...',
            tabs: {
                users: 'Korisnici',
                roles: 'Uloge'
            },
            stats: {
                total: 'Ukupno',
                active: 'Aktivno',
                users: 'korisnika',
                roles: 'uloga',
                system: 'Sistem',
                custom: 'Prilagođeno',
                totalUsers: 'Ukupno Korisnika'
            },
            error: {
                loadFailed: 'Neuspjelo učitavanje korisnika',
                rolesLoadFailed: 'Neuspjelo učitavanje uloga',
                createRoleFailed: 'Neuspjelo kreiranje uloge',
                createUserFailed: 'Neuspjelo kreiranje korisnika'
            }
        },
        settings: {
            title: 'Postavke',
            description: 'Upravljajte postavkama vašeg naloga.'
        },
        profile: {
            title: 'Profil',
            description: 'Pregledajte svoje lične podatke.',
            error: {
                loadFailed: 'Neuspjelo učitavanje informacija o profilu'
            },
            restaurantInfo: 'Informacije o Restoranu'
        },
        restaurant: {
            title: 'Upravljanje Restoranom',
            refresh: "Osvježi",
            description: 'Upravljajte informacijama i postavkama vašeg restorana.',
            loading: 'Učitavanje informacija o restoranu...',
            restaurantName: 'Ime Restorana',
            restaurantStatus: 'Status Restorana',
            restaurantLogo: 'Logo Restorana',
            companyInfo: 'Informacije o Kompaniji',
            addAboutInfo: 'Dodaj Informacije o Restoranu',
            placeholders: {
                restaurantName: 'Unesite ime restorana',
                aboutStory: 'Priča o našem restoranu',
                aboutDetails: 'Navedite detaljne informacije o vašem restoranu...'
            },



        },
        RestaurantManagement: {
            title: "Upravljanje Restoranom"
        },
        branchManagementTitle: "Upravljanje Filijalama",
        sidebar: {
            title: "QR Meni",
            logout: 'Odjava',
            branch: 'Filijala',
            backToRestaurant: 'Nazad na Panel Restorana'
        },
        branchProducts: {
            title: 'Proizvodi Filijale'
        },
        branchManagement: {
            title: 'Upravljanje Filijalama'
        }
    },

    // Theme
    theme: {
        toggleToDark: 'Prebaci na tamni način',
        toggleToLight: 'Prebaci na svijetli način',
        dark: 'Tamno',
        light: 'Svijetlo'
    },

    // Language
    language: {
        turkish: 'Türkçe',
        english: 'English',
        arabic: 'العربية',
        azerbaijani: 'Azərbaycan',
        albanian: 'Shqip',
        bosnian: 'Bosanski',
        selectLanguage: 'Odaberi Jezik'
    },

    // Settings
    settings: {
        title: 'Postavke',
        description: 'Upravljajte postavkama naloga i preferencijama',
        save: 'Sačuvaj',
        saveSuccess: 'Postavke uspješno sačuvane.',
        tabs: {
            general: 'Opšte',
            notifications: 'Obavještenja',
            privacy: 'Privatnost',
            appearance: 'Izgled',
            data: 'Podaci'
        },
        general: {
            title: 'Opšte Postavke',
            description: 'Konfigurišite osnovne postavke naloga',
            language: 'Jezik',
            timezone: 'Vremenska Zona',
            dateFormat: 'Format Datuma',
            currency: 'Valuta',
            autoSave: {
                title: 'Automatsko Čuvanje',
                description: 'Upravljajte postavkama automatskog čuvanja',
                enabled: 'Automatsko Čuvanje',
                enabledDesc: 'Automatski čuva vaše promjene',
                dataSync: 'Sinhronizacija Podataka',
                dataSyncDesc: 'Sinhronizuje vaše podatke na svim uređajima'
            }
        },
        notifications: {
            title: 'Postavke Obavještenja',
            description: 'Upravljajte preferencijama obavještenja',
            enabled: 'Omogući Obavještenja',
            enabledDesc: 'Omogućava sva obavještenja',
            email: 'Email Obavještenja',
            emailDesc: 'Primajte email za važne novosti',
            push: 'Push Obavještenja',
            pushDesc: 'Primajte trenutna obavještenja',
            sound: 'Zvučna Obavještenja',
            soundDesc: 'Omogućava zvukove obavještenja'
        },
        privacy: {
            title: 'Privatnost i Sigurnost',
            description: 'Upravljajte sigurnošću naloga i postavkama privatnosti',
            twoFactor: 'Dvofaktorska Autentifikacija',
            twoFactorDesc: 'Zaštitite svoj nalog dodatnom sigurnošću',
            autoLogout: 'Automatska Odjava',
            autoLogoutDesc: 'Odjavljuje se nakon 30 minuta neaktivnosti',
            analytics: 'Dijeljenje Analitičkih Podataka',
            analyticsDesc: 'Anonimno dijeljenje podataka za razvoj'
        },
        appearance: {
            title: 'Postavke Izgleda',
            description: 'Prilagodite preferencije interfejsa',
            darkMode: 'Omogući Tamni Način',
            lightMode: 'Omogući Svijetli Način',
            darkModeDesc: 'Koristi tamnu temu',
            lightModeDesc: 'Koristi svijetlu temu',
            compact: 'Kompaktan Prikaz',
            compactDesc: 'Kompaktan dizajn koji koristi manje prostora',
            animations: 'Animacije',
            animationsDesc: 'Omogućava animacije interfejsa'
        },
        data: {
            title: 'Upravljanje Podacima',
            description: 'Napravite rezervnu kopiju ili izbrišite svoje podatke',
            download: 'Preuzmi Podatke',
            downloadDesc: 'Preuzmite sve svoje podatke',
            upload: 'Otpremi Podatke',
            uploadDesc: 'Otpremite podatke iz rezervne kopije',
            delete: 'Izbriši Podatke',
            deleteDesc: 'Izbriši sve podatke',
            storage: 'Pohrana',
            storageDesc: 'Upravljajte prostorom za pohranu'
        }
    },

    // Notifications
    notifications: {
        title: 'Obavještenja',
        empty: 'Nema obavještenja',
        markAllAsRead: 'Označi sve kao pročitano'
    },

    // Brand
    brand: {
        name: 'QR Meni',
        slogan: 'Digitalno Restoransko Rješenje'
    },

// Features,
features: {
    title: 'Zašto',
        titleHighlight: 'QR Meni?',
            subtitle: 'Poboljšajte iskustvo kupaca i odvedite svoj posao u digitalno doba sa moćnim karakteristikama dizajniranim za moderne restorane.',
                list: {
        qrAccess: {
            title: 'Trenutan Pristup uz QR Kod',
                description: 'Vaši kupci mogu trenutno pristupiti vašem meniju skeniranjem QR koda na stolu. Nije potrebno preuzimanje aplikacije.'
        },
        mobileOptimized: {
            title: 'Mobilna Optimizacija',
                description: 'Savršen prikaz na svim uređajima. Optimalno iskustvo na telefonu, tabletu i računaru sa responzivnim dizajnom.'
        },
        instantUpdate: {
            title: 'Trenutno Ažuriranje',
                description: 'Promjene vašeg menija se objavljuju trenutno. Ažuriranja cijena i novi proizvodi su odmah vidljivi.'
        },
        analytics: {
            title: 'Detaljna Analitika',
                description: 'Dobijte izvještaje o tome koji proizvodi su više pregledani, ponašanju kupaca i trendovima prodaje.'
        },
        alwaysOpen: {
            title: 'Pristup 24/7',
                description: 'Vaši kupci mogu pogledati vaš meni bilo kada. Dostupno čak i van radnog vremena restorana.'
        },
        secure: {
            title: 'Sigurno i Brzo',
                description: 'Sigurno sa SSL certifikatom, brzo učitavanje stranica. Informacije o kupcima su zaštićene.'
        },
        customizable: {
            title: 'Prilagodljiv Dizajn',
                description: 'Opcije boja, fontova i dizajna pogodne za stil vašeg restorana. Odrazite identitet vašeg brenda.'
        },
        multiLanguage: {
            title: 'Višejezična Podrška',
                description: 'Možete ponuditi svoj meni na više jezika. Privucite svoje međunarodne kupce.'
        }
    },
    cta: {
        title: 'Spremni da Digitalizujete Svoj Restoran?',
            subtitle: 'Započnite danas i ponudite svojim kupcima moderno iskustvo. Postavljanje traje samo 5 minuta!',
                button: 'Isprobajte Besplatno'
    }
},

// Footer
footer: {
    description: 'Moderno, brzo i sigurno rješenje digitalnog menija za restorane. Poboljšajte iskustvo kupaca i digitalizujte svoj posao.',
        contact: {
        phone: '+90 531 732 47 31',
            email: 'services@idigitek.com',
                address: 'Istanbul , KayaŞehir'
    },
    sections: {
        product: {
            title: 'Proizvod',
                links: {
                features: 'Karakteristike',
                    pricing: 'Cijene',
                        demo: 'Demo',
                            api: 'API Dokumentacija'
            }
        },
        company: {
            title: 'Kompanija',
                links: {
                about: 'O nama',
                    pricing: 'Cijene',
                        careers: 'Karijere',
                            contact: 'Kontakt'
            }
        },
        support: {
            title: 'Podrška',
                links: {
                helpCenter: 'Centar za Pomoć',
                    faq: 'Česta Pitanja',
                        liveSupport: 'Podrška Uživo',
                            tutorials: 'Video Uputstva'
            }
        },
        legal: {
            title: 'Pravno',
                links: {
                privacy: 'Politika Privatnosti',
                    terms: 'Uslovi Korištenja',
                        cookies: 'Politika Kolačića',
                            gdpr: 'GDPR'
            }
        }
    },
    newsletter: {
        title: 'Budite U Toku',
            subtitle: 'Dobijajte informacije o novim karakteristikama i ažuriranjima.',
                placeholder: 'Vaša email adresa',
                    button: 'Pretplati se'
    },
    bottom: {
        copyright: 'Sva prava zadržana.',
            madeWith: 'Dizajnirano i razvijeno u Turskoj ❤️'
    }
},

// Auth Pages
pages: {
    login: {
        title: 'Prijava',
            subtitle: 'Prijavite se na svoj QR Meni nalog',
                backToHome: 'Nazad na Početnu',
                    email: 'Email',
                        password: 'Lozinka',
                            rememberMe: 'Zapamti Me',
                                forgotPassword: 'Zaboravljena Lozinka',
                                    confirimEmail : "Potvrdi Email",

                                        signIn: 'Prijavi se',
                                            signingIn: 'Prijavljivanje...',
                                                noAccount: 'Nemate nalog?',
                                                    registerNow: 'Registrujte se Sada',
                                                        errors: {
            emailRequired: 'Email je obavezan',
                emailInvalid: 'Molimo unesite ispravnu email adresu',
                    passwordRequired: 'Lozinka je obavezna',
                        invalidCredentials: 'Nevažeći email ili lozinka',
                            generalError: 'Došlo je do greške prilikom prijave. Molimo pokušajte ponovo.'
        }
    },
    register: {
        title: 'Kreiraj Nalog',
            subtitle: 'Pridružite se QR Meni porodici i digitalizujte svoj restoran',
                backToHome: 'Nazad na Početnu',
                    firstName: 'Ime',
                        lastName: 'Prezime',
                            email: 'Email',
                                phone: 'Broj Telefona',
                                    password: 'Lozinka',
                                        confirmPassword: 'Potvrdi Lozinku',
                                            createAccount: 'Kreiraj Nalog',
                                                creating: 'Kreiranje Naloga...',
                                                    haveAccount: 'Već imate nalog?',
                                                        signInNow: 'Prijavi se',
                                                            formProgress: 'Završetak forme',
                                                                placeholders: {
            firstName: 'Vaše ime',
                lastName: 'Vaše prezime',
                    email: 'primjer@email.com',
                        phone: '05XX XXX XX XX',
                            password: '••••••••',
                                confirmPassword: 'Ponovo unesite svoju lozinku'
        },
        validation: {
            nameRequired: 'Ime je obavezno',
                nameMin: 'Ime mora imati najmanje 2 znaka',
                    surnameRequired: 'Prezime je obavezno',
                        surnameMin: 'Prezime mora imati najmanje 2 znaka',
                            emailRequired: 'Email je obavezan',
                                emailInvalid: 'Molimo unesite ispravnu email adresu',
                                    phoneRequired: 'Broj telefona je obavezan',
                                        phoneInvalid: 'Molimo unesite ispravan broj telefona (npr. 05XX XXX XX XX)',
                                            passwordRequired: 'Lozinka je obavezna',
                                                passwordMin: 'Lozinka mora imati najmanje 8 znakova',
                                                    passwordPattern: 'Lozinka mora sadržavati barem jedno veliko slovo, jedno malo slovo i jedan broj',
                                                        passwordConfirmRequired: 'Potvrda lozinke je obavezna',
                                                            passwordMismatch: 'Lozinke se ne podudaraju',
                                                                termsRequired: 'Morate prihvatiti uslove korištenja',
                                                                    emailExists: 'Ova email adresa se već koristi'
        },
        passwordStrength: {
            veryWeak: 'Vrlo Slabo',
                weak: 'Slabo',
                    medium: 'Srednje',
                        good: 'Dobro',
                            strong: 'Jako'
        },
        terms: {
            service: 'Uslovi Korištenja',
                and: 'i',
                    privacy: 'Politika Privatnosti',
                        accept: 'Prihvatam'
        },
        errors: {
            validation: 'Molimo provjerite svoje registracijske podatke',
                invalidData: 'Uneseni su nevažeći podaci. Molimo provjerite.',
                    general: 'Došlo je do greške prilikom registracije. Molimo pokušajte ponovo.'
        },
        success: {
            message: 'Registracija uspješna! Sada možete unijeti podatke o svom restoranu.'
        }
    },
    forgotPassword: {
        title: 'Zaboravljena Lozinka',
            subtitle: 'Unesite svoju email adresu i poslat ćemo vam link za resetovanje lozinke',
                backToLogin: 'Nazad na Prijavu',
                    email: 'Email',
                        sendResetLink: 'Pošalji Link za Resetovanje',
                            sending: 'Slanje...',
                                resendCode: 'Pošalji Kod Ponovo',
                                    countdown: 'sekundi dok ne budete mogli ponovo poslati',
                                        placeholders: {
            email: 'primjer@email.com'
        },
        success: {
            title: 'Email Poslan!',
                message: 'Link za resetovanje lozinke je poslan na vašu email adresu. Molimo provjerite svoj email.'
        },
        errors: {
            emailRequired: 'Email je obavezan',
                emailInvalid: 'Molimo unesite ispravnu email adresu',
                    emailNotFound: 'Nije pronađen nalog sa ovom email adresom',
                        general: 'Došlo je do greške prilikom slanja linka za resetovanje lozinke. Molimo pokušajte ponovo.'
        }
    }
},

// Pricing
pricing: {
    title: 'Odaberite Svoj',
        titleHighlight: 'Savršen',
            titleEnd: 'Plan',
                subtitle: 'Fleksibilne opcije cijena dizajnirane za vaše potrebe. Možete promijeniti ili otkazati svoj plan bilo kada.',
                    monthly: 'Mjesečno',
                        yearly: 'Godišnje',
                            freeMonths: '2 MJESECA BESPLATNO',
                                mostPopular: 'Najpopularnije',
                                    plans: {
        basic: {
            name: 'Početni',
                features: {
                '0': '1 Restoran',
                    '1': '50 Proizvoda',
                        '2': 'Osnovna Analitika',
                            '3': 'Email Podrška',
                                '4': 'Generator QR Koda',
                                    '5': 'Mobilna Optimizacija'
            },
            button: 'Započnite'
        },
        pro: {
            name: 'Profesionalni',
                features: {
                '0': '3 Restorana',
                    '1': 'Neograničeno Proizvoda',
                        '2': 'Napredna Analitika',
                            '3': 'Prioritetna Podrška',
                                '4': 'Prilagođen Dizajn',
                                    '5': 'Višejezična Podrška',
                                        '6': 'API Pristup',
                                            '7': 'White Label'
            },
            button: 'Najpopularnije'
        },
        enterprise: {
            name: 'Preduzeće',
                features: {
                '0': 'Neograničeno Restorana',
                    '1': 'Neograničeno Proizvoda',
                        '2': 'Preduzeće Analitika',
                            '3': 'Telefonska Podrška 24/7',
                                '4': 'Prilagođena Integracija',
                                    '5': 'Posvećen Menadžer Naloga',
                                        '6': 'SLA Garancija',
                                            '7': 'Obuka i Konsultacije'
            },
            button: 'Kontaktirajte Nas'
        }
    },
    additionalInfo: 'Svi planovi uključuju 14-dnevno besplatno probno razdoblje • Kreditna kartica nije potrebna • Otkažite bilo kada',
        vatInfo: 'Cijene uključuju PDV. Dostupne prilagođene cijene za planove preduzeća.',
            perMonth: 'mjesec',
                perYear: 'godina',
                    monthlyEquivalent: 'Mjesečno {amount} (2 mjeseca besplatno)'
},

// Testimonials
testimonials: {
    title: 'Šta Naši Kupci',
        titleHighlight: 'Kažu',
            subtitle: 'Stvarna iskustva korisnika o sistemu QR Meni kojem vjeruje 500+ restorana širom Turske.',
                customers: [
                    {
                        name: 'Mehmet Özkan',
                        role: 'Vlasnik Restorana',
                        company: 'Lezzet Durağı',
                        content: 'Zahvaljujući QR Meniju, zadovoljstvo naših kupaca se povećalo za 40%. Posebno tokom pandemije, beskontaktni meni je pružio veliku prednost. Sistem je veoma jednostavan za korištenje.'
                    },
                    {
                        name: 'Ayşe Demir',
                        role: 'Generalni Menadžer',
                        company: 'Bella Vista Restaurant',
                        content: 'Naši kupci sada mogu pogledati meni bez čekanja konobara. Vrijeme primanja narudžbi je prepolovljeno. Zaista savršeno rješenje!'
                    },
                    {
                        name: 'Can Yılmaz',
                        role: 'Poslovni Partner',
                        company: 'Keyif Cafe',
                        content: 'Zahvaljujući analitičkim izvještajima, vidimo koji su proizvodi popularniji. Optimizovali smo naš meni i prodaja nam je porasla za 25%.'
                    },
                    {
                        name: 'Fatma Kaya',
                        role: 'Menadžer Restorana',
                        company: 'Anadolu Sofrası',
                        content: 'Ažuriranja cijena se odražavaju trenutno. Više se ne bavimo štampanjem menija. I ušteda troškova i ekološki prihvatljivo.'
                    },
                    {
                        name: 'Emre Şahin',
                        role: 'Vlasnik Lanca Restorana',
                        company: 'Burger House',
                        content: 'Upravljamo svim našim filijalama sa jednog mjesta. Možemo kreirati zasebne menije i cijene za svaku filijalu. Veličanstven sistem!'
                    },
                    {
                        name: 'Zeynep Arslan',
                        role: 'Vlasnik Kafića',
                        company: 'Kahve Köşesi',
                        content: 'Korisnička podrška je odlična. Dobili smo pomoć na svakom koraku tokom instalacije. Sada smo tehnološki kafić i naši kupci su veoma zadovoljni.'
                    }
                ],
                    stats: {
        restaurants: 'Sretnih Restorana',
            satisfaction: 'Stopa Zadovoljstva',
                support: 'Korisnička Podrška',
                    setup: 'Vrijeme Postavljanja'
    }
},

// FAQ
faq: {
    title: 'Često Postavljana',
        titleHighlight: 'Pitanja',
            subtitle: 'Sve što želite znati o QR Meniju je ovdje. Ako ne pronađete svoje pitanje, možete nas kontaktirati.',
                questions: {
        '1': {
            question: 'Kako funkcioniše QR Meni?',
                answer: 'Naš sistem QR Menija je veoma jednostavan. Kreiramo QR kod za vaš restoran. Vaši kupci mogu trenutno pristupiti vašem meniju skeniranjem ovog QR koda svojim telefonima. Nije potrebno preuzimanje aplikacije.'
        },
        '2': {
            question: 'Koliko traje postavljanje?',
                answer: 'Postavljanje traje samo 5 minuta! Nakon kreiranja naloga, otpremate i prilagođavate svoj meni. Vaš QR kod postaje spreman za upotrebu odmah.'
        },
        '3': {
            question: 'Mogu li vidjeti podatke o kupcima?',
                answer: 'Da! Pružamo detaljnu analitiku kao što su koji proizvodi se najviše pregledaju, najprometniji sati, ponašanja kupaca. Možete optimizovati svoj meni ovim podacima.'
        },
        '4': {
            question: 'Mogu li lako mijenjati cijene?',
                answer: 'Naravno! Možete ažurirati cijene, dodati nove proizvode ili urediti postojeće proizvode bilo kada sa svog admin panela. Promjene se objavljuju trenutno.'
        },
        '5': {
            question: 'Kako izgleda na mobilnim uređajima?',
                answer: 'Vaš meni izgleda savršeno na svim uređajima. Sa responzivnim dizajnom, pruža optimalno iskustvo na telefonima, tabletima i računarima.'
        },
        '6': {
            question: 'Postoji li korisnička podrška?',
                answer: 'Apsolutno! Pružamo podršku 24/7 putem emaila, telefona i chata uživo. Sa vama smo na svakom koraku od instalacije do upotrebe.'
        },
        '7': {
            question: 'Šta se dešava kada želim otkazati?',
                answer: 'Možete otkazati bilo kada. Nema ugovora ili penala. Nakon otkazivanja, sigurno vam dostavljamo vaše podatke.'
        },
        '8': {
            question: 'Mogu li upravljati sa više restorana?',
                answer: 'Sa našim Profesionalnim i Preduzeće planovima, možete upravljati sa više restorana sa jednog naloga. Zaseban meni i analitika za svaki restoran.'
        }
    },
    cta: {
        title: 'Imate li drugih pitanja?',
            subtitle: 'Kontaktirajte nas za pitanja na koja ne možete pronaći odgovore. Odgovaramo u roku od 24 sata.',
                button: 'Kontaktirajte Nas'
    }
},

// Contact
contact: {
    title: 'Stupite u',
        titleHighlight: 'Kontakt',
            titleEnd: 'sa Nama',
                subtitle: 'Imate li pitanja o sistemu QR Menija? Kontaktirajte nas.',
                    info: {
        title: 'Informacije o Kontaktu',
            phone: 'Telefon',
                email: 'Email',
                    address: 'Adresa'
    },
    form: {
        title: 'Pišite Nam',
            name: 'Ime i Prezime',
                nameRequired: 'Ime i Prezime *',
                    namePlaceholder: 'Unesite svoje ime',
                        email: 'Email',
                            emailRequired: 'Email *',
                                emailPlaceholder: 'Vaša email adresa',
                                    company: 'Restoran/Naziv Kompanije',
                                        companyPlaceholder: 'Naziv vašeg poslovanja',
                                            message: 'Vaša Poruka',
                                                messageRequired: 'Vaša Poruka *',
                                                    messagePlaceholder: 'Napišite svoju poruku...',
                                                        sending: 'Slanje...',
                                                            send: 'Pošalji Poruku',
                                                                success: {
            title: 'Vaša Poruka Je Poslana!',
                subtitle: 'Javit ćemo vam se što je prije moguće.'
        }
    }
},

// Accessibility
accessibility: {
    menu: 'Prebaci meni',
        theme: 'Promijeni temu',
            language: 'Promijeni jezik',
                profile: 'Meni profila',
                    notifications: 'Obavještenja'
},

// Orders
orders: {
    loading: 'Učitavanje narudžbi...',
        title: 'Narudžbe',
            description: 'Upravljajte i pratite sve svoje narudžbe',
                orderNumber: 'Narudžba',
                    table: 'Stol',
                        items: 'Stavke',
                            selectBranch : "Odaberi Filijalu",
                                selectBranchToView: "Odaberi Filijalu za Pregled",
                                    noBranches: "Nema Filijala",
                                        tabs: {
        all: 'Sve Narudžbe',
            pending: 'Na čekanju',
                preparing: 'U pripremi',
                    ready: 'Spremno',
                        delivered: 'Isporučeno',
                            cancelled: 'Otkazano'
    },
    status: {
        pending: 'Na čekanju',
            preparing: 'U pripremi',
                ready: 'Spremno',
                    delivered: 'Isporučeno',
                        cancelled: 'Otkazano'
    },
    filters: {
        status: 'Status',
            dateRange: 'Vremenski Raspon',
                paymentType: 'Tip Plaćanja',
                    today: 'Danas',
                        yesterday: 'Juče',
                            lastWeek: 'Prošla Sedmica',
                                lastMonth: 'Prošli Mjesec',
                                    custom: 'Prilagođeno'
    },
    actions: {
        refresh: 'Osvježi',
      export: 'Izvezi',
            filter: 'Filtriraj',
                search: 'Pretraži narudžbe...',
                    viewDetails: 'Vidi Detalje',
                        changeStatus: 'Promijeni Status'
    },
    stats: {
        totalOrders: 'Ukupno Narudžbi',
            totalRevenue: 'Ukupan Prihod',
                pendingOrders: 'Narudžbe na čekanju',
                    avgOrderValue: 'Prosječna Vrijednost Narudžbe'
    }
},

// Table Management
tableManagement: {
    addTable: "Dodaj Stol",
        loading: 'Učitavanje stolova...',
            title: 'Upravljanje Stolovima',
                ActiveStatus : "Status Aktivnosti",
                    selectBranchPrompt: "Nema Filijala",
                        selectBranch : "Odaberi Filijalu",

                            descriptionActive : "Područje je aktivno",
                                descriptionInActive : "Područje je neaktivno",

                                    description: 'Upravljajte svojim QR kodovima i stolovima',
                                        noCategories : "Nije Pronađeno Područje",
                                            createFirstCategory: "Kreiraj Prvo Područje",

                                                areaTypes: {
        indoor: 'Unutra',
            outdoor: 'Vani',
                terrace: 'Terasa',
                    garden: 'Bašta'
    },

    error: {
        loadFailed: 'Neuspjelo učitavanje liste filijala',
            dataLoadFailed: 'Došlo je do greške prilikom učitavanja podataka'
    },
    deleteModal: { title: "Jeste li sigurni da želite izbrisati stavku?" },
    actions: {
        addTable: 'Dodaj Stol',
            addQRCode: 'Dodaj QR Kod',
                generateQR: 'Generiši QR Kod',
                    downloadQR: 'Preuzmi QR Kod',
                        editTable: 'Uredi Stol',
                            deleteTable: 'Izbriši Stol',
},
categories: {
    title: 'Upravljanje Područjima',
        addCategory: 'Dodaj Područje',
            editCategory: 'Uredi Područje',
                deleteCategory: 'Izbriši Područje',
                    categoryName: 'Ime Područja',
                        tableCount: 'Broj Stolova'
},
qrCodes: {
    title: 'QR Kodovi',
        tableNumber: 'Broj Stola',
            category: 'Kategorija',
                status: 'Status',
                    actions: 'Radnje',
                        active: 'Aktivno',
                            inactive: 'Neaktivno'
}
  },
// User Management
userManagement: {
    loading: 'Učitavanje korisnika...',
        title: 'Upravljanje Korisnicima',
            noBranch: 'Nije odabrana filijala. Molimo odaberite filijalu za upravljanje korisnicima.',
                description: 'Upravljajte korisnicima, ulogama i dozvolama',
                    error: {
        loadFailed: 'Došlo je do greške prilikom učitavanja korisnika',
            rolesLoadFailed: 'Došlo je do greške prilikom učitavanja uloga',
                createFailed: 'Došlo je do greške prilikom kreiranja korisnika',
                    updateFailed: 'Došlo je do greške prilikom ažuriranja korisnika',
                        deleteFailed: 'Došlo je do greške prilikom brisanja korisnika'
    },
    actions: {
        addUser: 'Dodaj Korisnika',
            editUser: 'Uredi Korisnika',
                deleteUser: 'Izbriši Korisnika',
                    resetPassword: 'Resetuj Lozinku',
                        changeRole: 'Promijeni Ulogu'
    },
    roles: {
        admin: 'Admin',
            manager: 'Menadžer',
                staff: 'Osoblje',
                    viewer: 'Posmatrač'
    },
    status: {
        active: 'Aktivno',
            inactive: 'Neaktivno',
                suspended: 'Suspendovano'
    }
},

// Subscription
subscription: {
    title: 'Pretplata',
        description: 'Upravljajte svojim planom pretplate i pregledajte svoje račune',
            currentPlan: 'Trenutni Plan',
                planDetails: 'Detalji Plana',
                    billing: 'Naplata',
                        usage: 'Upotreba',
                            plan: 'Plan',
                                renewal: 'Obnova',
                                    changePlan: 'Promijeni Plan',
                                        availablePlans: 'Dostupni Planovi',
                                            selectPlan: 'Odaberite plan koji odgovara vašim potrebama',
                                                tabs: {
        overview: 'Pregled',
            billing: 'Naplata',
                usage: 'Upotreba'
    },
    actions: {
        upgrade: 'Nadogradi',
            downgrade: 'Smanji',
                cancel: 'Otkaži',
                    renew: 'Obnovi',
                        settings: 'Postavke'
    }
},

products: {
    status: {
        outOfStock: 'Nema na stanju',
            inStock: 'Na stanju',
                available: 'Dostupno',
                    unavailable: 'Nedostupno'
    },
    count: 'proizvoda',
        empty: 'Još nema proizvoda u ovoj kategoriji',
            actions: {
        addFirst: 'Dodaj prvi proizvod',
            addProduct: 'Dodaj Proizvod',
                editProduct: 'Uredi Proizvod',
                    deleteProduct: 'Izbriši Proizvod'
    }
},

branchSelector: {
    status: {
        loading: 'Učitavanje...',
            error: 'Nije moguće učitati listu filijala'
    },
    empty: 'Nema pronađenih opcija',
        actions: {
        changeBranchRestaurant: 'Promijeni Filijalu/Restoran'
    },
    labels: {
        mainRestaurant: 'Glavni Restoran',
            branches: 'Filijale'
    }
},

popularProducts: {
    title: 'Popularni Proizvodi',
        empty: 'Prodaja proizvoda će se pojaviti ovdje',
            labels: {
        orders: 'narudžbi',
            percentage: '%'
    },
    tooltip: {
        ordersFormat: (value: any, percentage: any) => `${value} narudžbi (${percentage}%)`,
            noData: 'Nema dostupnih podataka'
    }
},

weeklyActivity: {
    title: 'Sedmična Aktivnost',
        empty: {
        primary: 'Još nema podataka o aktivnostima',
            secondary: 'Podaci će se pojaviti ovdje uskoro'
    },
    labels: {
        views: 'Pregledi',
            qrScans: 'QR Skeniranja'
    },
    legend: {
        views: 'Pregledi',
            qrScans: 'QR Skeniranja'
    }
},

monthlyRevenue: {
    QuickStats: "Brza Statistika",
        title: 'Trend Mjesečnog Prihoda',
            empty: {
        primary: 'Još nema dostupnih podataka o prihodima',
            secondary: 'Podaci o prihodima će se pojaviti ovdje'
    },
    labels: {
        total: 'Ukupno:',
            revenue: 'Prihod'
    },
    currency: {
        symbol: 'KM',
            format: (value: { toLocaleString: (arg0: string) => any; }) => `${value.toLocaleString('bs-BA')} KM`
    }
},

branchCard: {
    status: {
        temporaryClosed: 'Privremeno Zatvoreno',
            open: 'Otvoreno',
                closed: 'Zatvoreno',
                    active: 'Aktivno',
                        inactive: 'Neaktivno',
                            hidden: 'Skriveno'
    },
    actions: {
        edit: 'Uredi',
            delete: 'Izbriši',
                purge: 'Trajno Obriši Podatke Filijale'
    },
    labels: {
        customerVisibility: 'Vidljivost za Kupce',
            apiBranchOpen: 'API FilijalaOtvorena:'
    },
    alt: {
        logo: 'logo'
    }
},

addBranchCard: {
    title: 'Dodaj Novu Filijalu',
        description: 'Kliknite da dodate novu filijalu'
},

branchModal: {
    title: {
        add: 'Dodaj Novu Filijalu',
            edit: 'Uredi Filijalu'
    },
    subtitle: 'Možete unijeti informacije o filijali korak po korak',
        steps: {
        basic: 'Osnovne Informacije',
            address: 'Informacije o Adresi',
                contact: 'Kontakt i Radno Vrijeme'
    },
    sections: {
        basicInfo: 'Osnovne Informacije',
            addressInfo: 'Informacije o Adresi',
                contactInfo: 'Kontakt Informacije',
                    workingHours: 'Radno Vrijeme'
    },
    fields: {
        branchName: {
            label: 'Ime Filijale',
                placeholder: 'Unesite ime filijale'
        },
        whatsappNumber: {
            label: 'WhatsApp Broj za Narudžbe ',
                placeholder: 'Unesite WhatsApp broj za narudžbe'
        },
        branchLogo: {
            label: 'Logo Filijale (Opcionalno)',
                select: 'Odaberi Logo',
                    uploading: 'Učitavanje...',
                        success: '✓ Logo uspješno učitan',
                            preview: 'Pregled logotipa filijale',
                                supportText: 'Podržani su PNG, JPG, GIF formati. Maksimalna veličina fajla: 5MB'
        },
        country: {
            label: 'Država ',
                placeholder: 'Unesite ime države'
        },
        city: {
            label: 'Grad ',
                placeholder: 'Unesite ime grada'
        },
        street: {
            label: 'Ulica ',
                placeholder: 'Unesite ime ulice'
        },
        zipCode: {
            label: 'Poštanski Broj',
                placeholder: 'Unesite poštanski broj'
        },
        addressLine1: {
            label: 'Adresa Linija 1',
                placeholder: 'Unesite detaljne informacije o adresi'
        },
        addressLine2: {
            label: 'Adresa Linija 2 (Opcionalno)',
                placeholder: 'Unesite dodatne informacije o adresi (opcionalno)'
        },
        phone: {
            label: 'Broj Telefona ',
                placeholder: 'Unesite broj telefona'
        },
        email: {
            label: 'Email Adresa ',
                placeholder: 'Unesite email adresu'
        },
        location: {
            label: 'Informacije o Lokaciji (Opcionalno)',
                placeholder: 'Unesite informacije o lokaciji (npr. 40.9795,28.7225)'
        },
        contactHeader: {
            label: 'Zaglavlje Kontakta (Opcionalno)',
                placeholder: 'Unesite zaglavlje kontakta (opcionalno)'
        },
        footerTitle: {
            label: 'Naslov u Podnožju (Opcionalno)',
                placeholder: 'Unesite naslov u podnožju (opcionalno)'
        },
        footerDescription: {
            label: 'Opis u Podnožju (Opcionalno)',
                placeholder: 'Unesite opis u podnožju (opcionalno)'
        },
        openTitle: {
            label: 'Naslov Radnog Vremena (Opcionalno)',
                placeholder: 'Unesite naslov radnog vremena (opcionalno)'
        },
        openDays: {
            label: 'Otvoreni Dani (Opcionalno)',
                placeholder: 'Unesite otvorene dane (opcionalno)'
        },
        openHours: {
            label: 'Radno Vrijeme (Opcionalno)',
                placeholder: 'Unesite radno vrijeme (opcionalno)'
        }
    },
    workingHours: {
        description: 'Postavite radno vrijeme vašeg poslovanja',
            days: ['Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota', 'Nedjelja'],
                open: 'Otvoreno',
                    closed: 'Zatvoreno',
                        openTime: 'Otvori',
                            closeTime: 'Zatvori',
                                canOrder: '✓ Kupci mogu naručivati na ovaj dan',
                                    infoTitle: 'O Radnom Vremenu',
                                        infoText: 'Sati koje ovdje postavite određuju kada kupci mogu naručivati putem vašeg QR menija. Narudžbe se ne primaju zatvorenim danima.'
    },
    errors: {
        branchName: 'Ime filijale je obavezno',
            whatsappNumber: 'WhatsApp broj za narudžbe je obavezan',
                country: 'Država je obavezna',
                    city: 'Grad je obavezan',
                        street: 'Ulica je obavezna',
                            zipCode: 'Poštanski broj je obavezan',
                                addressLine1: 'Adresa linija 1 je obavezna',
                                    phone: 'Broj telefona je obavezan',
                                        email: 'Email adresa je obavezna',
                                            location: 'Informacije o lokaciji su obavezne',
                                                branchModal: "Logo je obavezan",
                                                    addressLine2: "Detaljna adresa je obavezna"
    },
    buttons: {
        cancel: 'Otkaži',
            back: 'Nazad',
                next: 'Sljedeće',
                    save: 'Sačuvaj',
                        saving: 'Čuvanje...'
    }
},

branchManagement: {
    title: 'Upravljanje Filijalama',
        description: 'Upravljajte filijalama restorana i ažurirajte njihove informacije',
            loading: 'Učitavanje filijala...',
                addBranch: 'Dodaj Novu Filijalu',

                    // Error messages
                    error: {
        loadFailed: 'Neuspjelo učitavanje filijala',
            createFailed: 'Neuspjelo kreiranje filijale',
                updateFailed: 'Neuspjelo ažuriranje filijale',
                    deleteFailed: 'Neuspjelo brisanje filijale',
                        restaurantIdNotFound: 'ID restorana nije pronađen',
                            detailsLoadFailed: 'Neuspjelo učitavanje detalja filijale',
                                statusUpdateFailed: 'Neuspjelo ažuriranje statusa filijale',
                                    validationFailed: 'Molimo ispravite validacijske greške ispod',
                                        sessionExpired: 'Sesija je istekla. Molimo prijavite se ponovo.',
                                            noPermission: 'Nemate dozvolu za ovu operaciju.',
                                                branchNotFound: 'Filijala nije pronađena.',
                                                    connectionError: 'Provjerite svoju internet vezu.',
                                                        unknownError: 'Došlo je do neočekivane greške'
    },

    // No branches state
    noBranches: {
        title: 'Još nema filijala',
            description: 'Započnite dodavanjem svoje prve filijale restorana'
    },

    // Delete confirmation
    deleteConfirm: {
        title: 'Potvrdite Brisanje Filijale',
            description: 'Jeste li sigurni da želite izbrisati filijalu? Ova radnja se ne može poništiti.'
    },

    // Purge confirmation (permanent deletion)
    purgeConfirm: {
        title: 'Upozorenje o Trajnom Brisanju',
            description: 'Ovo će TRAJNO izbrisati filijalu i SVE povezane podatke. Ova radnja se NE MOŽE poništiti!'
    },

    // Form labels and fields
    form: {
        branchName: 'Ime Filijale',
            branchNamePlaceholder: 'Unesite ime filijale',
                branchNameRequired: 'Ime filijale je obavezno',
                    whatsappNumber: 'WhatsApp Broj za Narudžbe ',
                        whatsappPlaceholder: 'Unesite WhatsApp broj',
                            branchLogo: 'Logo Filijale',
                                logoUpload: 'Učitaj Logo',
                                    logoChange: 'Promijeni Logo',
                                        logoRemove: 'Ukloni Logo',
                                            logoNotSelected: 'Nijedan logo nije odabran',
                                                logoInstructions: 'Možete učitati JPG, PNG ili GIF fajlove, maksimalne veličine 5MB.',

                                                    // Address fields
                                                    country: 'Država *',
                                                        countryPlaceholder: 'Unesite ime države',
                                                            city: 'Grad *',
                                                                cityPlaceholder: 'Unesite ime grada',
                                                                    street: 'Ulica',
                                                                        streetPlaceholder: 'Unesite ime ulice',
                                                                            zipCode: 'Poštanski Broj',
                                                                                zipCodePlaceholder: 'Unesite poštanski broj',
                                                                                    addressLine1: 'Adresa Linija 1',
                                                                                        addressLine1Placeholder: 'Unesite detalje adrese',
                                                                                            addressLine2: 'Adresa Linija 2',
                                                                                                addressLine2Placeholder: 'Dodatne informacije o adresi (opcionalno)',

                                                                                                    // Contact fields
                                                                                                    phone: 'Telefon *',
                                                                                                        phonePlaceholder: 'Unesite broj telefona',
                                                                                                            email: 'Email *',
                                                                                                                emailPlaceholder: 'Unesite email adresu',
                                                                                                                    location: 'Lokacija',
                                                                                                                        locationPlaceholder: 'Unesite informacije o lokaciji',
                                                                                                                            contactHeader: 'Zaglavlje Kontakta',
                                                                                                                                contactHeaderPlaceholder: 'Unesite zaglavlje kontakta',
                                                                                                                                    footerTitle: 'Naslov u Podnožju',
                                                                                                                                        footerTitlePlaceholder: 'Unesite naslov u podnožju',
                                                                                                                                            footerDescription: 'Opis u Podnožju',
                                                                                                                                                footerDescriptionPlaceholder: 'Unesite opis u podnožju',
                                                                                                                                                    openTitle: 'Naslov Radnog Vremena',
                                                                                                                                                        openTitlePlaceholder: 'Unesite naslov radnog vremena',
                                                                                                                                                            openDays: 'Otvoreni Dani',
                                                                                                                                                                openDaysPlaceholder: 'Unesite otvorene dane',
                                                                                                                                                                    openHours: 'Radno Vrijeme',
                                                                                                                                                                        openHoursPlaceholder: 'Unesite radno vrijeme',

                                                                                                                                                                            // Working hours
                                                                                                                                                                            workingHours: 'Radno Vrijeme',
                                                                                                                                                                                workingHoursRequired: 'Najmanje jedan radni dan mora biti odabran',
                                                                                                                                                                                    isOpen: 'Otvoreno',
                                                                                                                                                                                        dayNames: {
            0: 'Nedjelja',
                1: 'Ponedjeljak',
                    2: 'Utorak',
                        3: 'Srijeda',
                            4: 'Četvrtak',
                                5: 'Petak',
                                    6: 'Subota'
        }
    },

    // Modal titles and tabs
    modal: {
        createTitle: 'Dodaj Novu Filijalu',
            createDescription: 'Unesite informacije o novoj filijali',
                editTitle: 'Uredi Filijalu',
                    editDescription: 'Uredite informacije o filijali',

                        tabs: {
            general: 'Opšte Informacije',
                address: 'Adresa',
                    contact: 'Kontakt',
                        workingHours: 'Radno Vrijeme'
        },

        buttons: {
            creating: 'Kreiranje...',
                updating: 'Ažuriranje...',
                    create: 'Kreiraj Filijalu',
                        update: 'Ažuriraj Filijalu'
        },

        errors: {
            updateError: 'Greška pri Ažuriranju',
                validationFailed: 'Molimo ispravite greške u formi i pokušajte ponovo.',
                    dataValidationError: 'Došlo je do greške tokom ažuriranja. Molimo provjerite unesene podatke.',
                        imageUploadError: 'Neuspjelo učitavanje slike. Molimo pokušajte ponovo.',
                            imageRemoveError: 'Neuspjelo uklanjanje slike.',
                                uploadingImage: 'Učitavanje slike...',
                                    invalidFileType: 'Molimo odaberite ispravan fajl slike',
                                        fileSizeError: 'Veličina fajla mora biti manja od 5MB'
        }
    },

    // Branch card actions
    card: {
        edit: 'Uredi',
            delete: 'Izbriši',
                temporaryClose: 'Privremeno Zatvori',
                    temporaryOpen: 'Privremeno Otvori',
                        status: {
            open: 'Otvoreno',
                closed: 'Zatvoreno',
                    temporarilyClosed: 'Privremeno Zatvoreno'
        }
    }
},
// Common translations
commonBranch: {
    cancel: 'Otkaži',
        delete: 'Izbriši',
            save: 'Sačuvaj',
                edit: 'Uredi',
                    create: 'Kreiraj',
                        update: 'Ažuriraj',
                            close: 'Zatvori',
                                loading: 'Učitavanje...',
                                    error: 'Greška',
                                        success: 'Uspjeh',
                                            warning: 'Upozorenje',
                                                info: 'Informacija',
                                                    required: 'Obavezno',
                                                        optional: 'Opcionalno'
},

productsContent: {
    branch: {
        selectAll: "Sve",

    },
    title: 'Upravljanje Proizvodima',
        description: 'Upravljajte kategorijama menija i proizvodima',

            // Search and filters
            search: {
        placeholder: 'Pretraži stavke menija...',
            filter: 'Filtriraj',
                sort: 'Sortiraj',
                    noResults: 'Nema pronađenih proizvoda'
    },

    // View modes
    viewMode: {
list: 'Lista Prikaz',
    grid: 'Mreža Prikaz'
  },

// Buttons and actions
actions: {
    addFirstCategory: 'Dodaj Prvu Kategoriju',
        addCategory: 'Nova Kategorija',
            newCategory: 'Nova Kategorija',
                addProduct: 'Novi Proizvod',
                    newProduct: 'Novi Proizvod',
                        editCategory: 'Uredi Kategoriju',
                            deleteCategory: 'Izbriši Kategoriju',
                                editProduct: 'Uredi Proizvod',
                                    deleteProduct: 'Izbriši Proizvod',
                                        manageIngredients: 'Upravljaj Sastojcima',
                                            manageExtras: 'Upravljaj Dodacima',
                                                updateIngredients: 'Ažuriraj Sastojke',
                                                    manageAddons: 'Upravljaj Prilozima',
                                                        importSampleMenu: 'Uvezi Uzorak Menija',
                                                            addFirstCategoryTitle: 'Dodaj Prvu Kategoriju',
                                                                RecycleBin: "Kanta za Otpatke"
},

// Empty states
emptyState: {
    noCategories: {
        title: 'Još nema kategorija menija',
            description: 'Započnite kreiranje menija vašeg restorana dodavanjem prve kategorije. Na primjer "Glavna Jela", "Pića" ili "Deserti".',
                addFirstCategory: 'Dodaj Prvu Kategoriju'
    }
},

// Loading states
loading: {
    categories: 'Učitavanje kategorija...',
        products: 'Učitavanje proizvoda...',
            savingOrder: 'Čuvanje narudžbe...',
                savingCategoryOrder: 'Čuvanje redoslijeda kategorija...',
                    savingProductOrder: 'Čuvanje redoslijeda proizvoda...',
                        movingProduct: 'Premještanje proizvoda...',
                            deleting: 'Brisanje...'
},

// Drag and drop
dragDrop: {
    categoryReordering: 'Čuvanje redoslijeda kategorija...',
        productReordering: 'Čuvanje redoslijeda proizvoda...',
            productMoving: 'Premještanje proizvoda...',
                categoryOrderSaveError: 'Došlo je do greške prilikom čuvanja redoslijeda kategorija.',
                    productOrderSaveError: 'Došlo je do greške prilikom čuvanja redoslijeda proizvoda.',
                        productMoveError: 'Došlo je do greške prilikom premještanja proizvoda.'
},

// Delete confirmations
delete: {
    product: {
        title: 'Izbriši Proizvod',
            message: 'Jeste li sigurni da želite izbrisati "{{productName}}"? Ova radnja se ne može poništiti.',
                success: 'Proizvod uspješno izbrisan'
    },
    category: {
        title: 'Izbriši Kategoriju',
            messageWithProducts: 'Kategorija "{categoryName}" sadrži {productCount} proizvoda. Brisanje ove kategorije će također izbrisati sve proizvode. Jeste li sigurni da želite nastaviti?',
                messageEmpty: 'Jeste li sigurni da želite izbrisati kategoriju "{categoryName}"?',
                    success: 'Kategorija uspješno izbrisana'
    }
},

// Error messages
error: {
    loadFailed: 'Neuspjelo učitavanje podataka',
        categoryNotFound: 'Kategorija nije pronađena',
            productNotFound: 'Proizvod nije pronađen',
                deleteFailed: 'Neuspjelo brisanje',
                    updateFailed: 'Neuspjelo ažuriranje',
                        createFailed: 'Neuspjelo kreiranje',
                            reorderFailed: 'Neuspjelo preuređivanje',
                                invalidData: 'Nevažeći podaci',
                                    networkError: 'Greška mrežne veze',
                                        refreshPage: 'Molimo osvježite stranicu i pokušajte ponovo.'
},

// Success messages
success: {
    categoryCreated: 'Kategorija uspješno kreirana',
        categoryUpdated: 'Kategorija uspješno ažurirana',
            categoryDeleted: 'Kategorija uspješno izbrisana',
                productCreated: 'Proizvod uspješno kreiran',
                    productUpdated: 'Proizvod uspješno ažuriran',
                        productDeleted: 'Proizvod uspješno izbrisan',
                            orderSaved: 'Narudžba uspješno sačuvana',
                                ingredientsUpdated: 'Sastojci uspješno ažurirani',
                                    addonsUpdated: 'Prilozi uspješno ažurirani'
},

// Categories
category: {
    products: 'proizvodi',
        productCount: 'proizvod',
            noProducts: 'Nema proizvoda u ovoj kategoriji',
                expand: 'Proširi',
                    collapse: 'Sažmi'
},

// Products
product: {
    price: 'Cijena',
        description: 'Opis',
            ingredients: 'Sastojci',
                addons: 'Prilozi',
                    category: 'Kategorija',
                        image: 'Slika',
                            status: 'Status',
                                available: 'Dostupno',
                                    unavailable: 'Nedostupno'
},

// Currency
currency: {
    symbol: '',
        format: '{{amount}}'
},

// Status indicators
status: {
    active: 'Aktivno',
        inactive: 'Neaktivno',
            available: 'Dostupno',
                unavailable: 'Nedostupno'
},

// Tooltips
tooltips: {
    dragToReorder: 'Povucite za preuređivanje',
        dragToMoveCategory: 'Povucite da premjestite proizvod u drugu kategoriju',
            expandCategory: 'Proširi kategoriju',
                collapseCategory: 'Sažmi kategoriju',
                    editCategory: 'Uredi kategoriju',
                        deleteCategory: 'Izbriši kategoriju',
                            editProduct: 'Uredi proizvod',
                                deleteProduct: 'Izbriši proizvod',
                                    manageIngredients: 'Upravljaj sastojcima proizvoda',
                                        manageAddons: 'Upravljaj prilozima proizvoda'
}
  },

createCategoryModal: {
    // Header
    title: 'Dodaj Novu Kategoriju',
        subtitle: 'Kreiraj kategoriju menija',
            close: 'Zatvori',

                // Form fields
                form: {
        categoryName: {
            label: 'Ime Kategorije *',
                placeholder: 'npr: Glavna Jela, Pića, Deserti',
                    required: 'Ime kategorije je obavezno'
        },
        status: {
            label: 'Aktiviraj kategoriju',
                description: 'Aktivne kategorije se pojavljuju u meniju'
        }
    },

    // Buttons
    buttons: {
        cancel: 'Otkaži',
            create: 'Dodaj Kategoriju',
                creating: 'Dodavanje...'
    },

    // Error messages
    errors: {
        general: 'Došlo je do greške prilikom dodavanja kategorije. Molimo pokušajte ponovo.',
            categoryExists: 'Kategorija sa ovim imenom već postoji. Molimo odaberite drugo ime.',
                invalidData: 'Uneseni podaci su nevažeći. Molimo provjerite i pokušajte ponovo.',
                    serverError: 'Došlo je do greške na serveru. Molimo pokušajte kasnije.',
                        networkError: 'Greška mrežne veze. Provjerite svoju vezu i pokušajte ponovo.',
                            unknownError: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo.',
                                errorLabel: 'Greška:'
    },

    // Success messages
    success: {
        categoryCreated: 'Kategorija uspješno kreirana',
            categoryAdded: 'Kategorija uspješno dodana u meni'
    },

    // Validation messages
    validation: {
        nameRequired: 'Ime kategorije je obavezno',
            nameMinLength: 'Ime kategorije mora imati više od 2 znaka',
                nameMaxLength: 'Ime kategorije mora imati manje od 50 znakova',
                    invalidCharacters: 'Ime kategorije sadrži nevažeće znakove'
    },

    // Accessibility
    accessibility: {
        closeModal: 'Zatvori prozor za dodavanje kategorije',
            formTitle: 'Prozor za dodavanje nove kategorije',
                requiredField: 'Obavezno polje',
                    optionalField: 'Opcionalno polje'
    }
},

createProductModal: {
    // Header
    title: 'Dodaj Novi Proizvod',
        subtitle: 'Dodaj proizvod u svoj meni',
            close: 'Zatvori',

                // Form fields
                form: {
        productImage: {
            label: 'Slika Proizvoda',
                dragActive: 'Ispusti fajl ovdje',
                    uploadText: 'Učitaj sliku',
                        supportedFormats: 'PNG, JPG, GIF (5MB max)',
                            removeImage: 'Ukloni sliku'
        },
        productName: {
            label: 'Ime Proizvoda',
                placeholder: 'npr: Margarita Pizza',
                    required: 'Ime proizvoda je obavezno'
        },
        price: {
            label: 'Cijena',
                placeholder: '0',
                    required: 'Cijena je obavezna',
                        mustBePositive: 'Cijena mora biti veća od 0',
                            currency: ''
        },
        category: {
            label: 'Kategorija',
                placeholder: 'Odaberi kategoriju',
                    required: 'Odabir kategorije je obavezan',
                        invalidCategory: 'Odabrana kategorija je nevažeća. Dostupne kategorije: {{categories}}'
        },
        description: {
            label: 'Opis',
                placeholder: 'Opis proizvoda...',
                    required: 'Opis proizvoda je obavezan'
        },
        status: {
            label: 'Aktiviraj proizvod',
                description: 'Prikazuje se u meniju',
                    active: 'Aktivno',
                        inactive: 'Neaktivno'
        }
    },

    // Buttons
    buttons: {
        cancel: 'Otkaži',
            create: 'Dodaj Proizvod',
                creating: 'Dodavanje...',
                    uploading: 'Učitavanje...'
    },

    // Image upload
    imageUpload: {
        dragToUpload: 'Povucite sliku ovdje ili kliknite za učitavanje',
            clickToUpload: 'Kliknite za učitavanje slike',
                dragActive: 'Ispustite fajl ovdje',
                    supportedFormats: 'PNG, JPG, GIF',
                        maxSize: '5MB max',
                            preview: 'Pregled slike',
                                remove: 'Ukloni'
    },

    // Error messages
    errors: {
        general: 'Došlo je do greške prilikom dodavanja proizvoda. Molimo pokušajte ponovo.',
            nameRequired: 'Ime proizvoda je obavezno',
                descriptionRequired: 'Opis proizvoda je obavezan',
                    priceRequired: 'Cijena je obavezna',
                        priceMustBePositive: 'Cijena mora biti veća od 0',
                            categoryRequired: 'Odabir kategorije je obavezan',
                                categoryInvalid: 'Odabrana kategorija je nevažeća',
                                    imageInvalid: 'Molimo odaberite ispravan fajl slike',
                                        imageTooLarge: 'Veličina fajla slike mora biti manja od 5MB',
                                            imageUploadFailed: 'Neuspjelo učitavanje slike',
                                                networkError: 'Greška mrežne veze. Provjerite svoju vezu i pokušajte ponovo.',
                                                    serverError: 'Došlo je do greške na serveru. Molimo pokušajte kasnije.',
                                                        unknownError: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo.',
                                                            errorLabel: 'Greška:'
    },

    // Success messages
    success: {
        productCreated: 'Proizvod uspješno kreiran',
            productAdded: 'Proizvod uspješno dodan u meni'
    },

    // Validation messages
    validation: {
        nameMinLength: 'Ime proizvoda mora imati više od 2 znaka',
            nameMaxLength: 'Ime proizvoda mora imati manje od 100 znakova',
                descriptionMinLength: 'Opis mora imati više od 5 znakova',
                    descriptionMaxLength: 'Opis mora imati manje od 500 znakova',
                        priceMin: 'Cijena mora biti veća od 0',
                            priceMax: 'Cijena mora biti manja od 10000'
    },

    // Accessibility
    accessibility: {
        closeModal: 'Zatvori prozor za dodavanje proizvoda',
            formTitle: 'Forma za dodavanje novog proizvoda',
                requiredField: 'Obavezno polje',
                    optionalField: 'Opcionalno polje',
                        imageUpload: 'Učitaj sliku proizvoda',
                            removeImage: 'Ukloni sliku proizvoda',
                                priceInput: 'Unesite cijenu proizvoda',
                                    categorySelect: 'Odaberite kategoriju proizvoda',
                                        statusToggle: 'Promijeni status proizvoda'
    }
},

productAddonsModal: {
    // Header
    title: 'Prilozi Proizvoda',
        subtitle: 'upravljajte prilozima za',
            close: 'Zatvori',

                // Panel titles
                panels: {
        currentAddons: {
            title: 'Trenutni Prilozi',
                count: '({{count}})',
                    dragInstruction: 'Možete mijenjati redoslijed povlačenjem',
                        emptyState: {
                title: 'Još nema dodanih priloga.',
                    subtitle: 'Odaberite proizvode sa desnog panela.'
            }
        },
        availableProducts: {
            title: 'Proizvodi Dostupni kao Prilozi',
                searchPlaceholder: 'Pretraži proizvode...',
                    emptyState: {
                noResults: 'Nema pronađenih proizvoda koji odgovaraju kriterijima pretrage.',
                    noProducts: 'Nema proizvoda koji se mogu dodati.'
            }
        }
    },

    // Addon item actions
    actions: {
        edit: 'Uredi',
            save: 'Sačuvaj',
                cancel: 'Otkaži',
                    remove: 'Ukloni',
                        recommended: 'Preporučeno'
    },

    // Form fields
    form: {
        marketingText: {
            placeholder: 'Marketinški tekst...',
                label: 'Marketinški Tekst'
        },
        isRecommended: {
            label: 'Označi kao preporučeni prilog',
                badge: 'Preporučeno'
        }
    },

    // Product status
    status: {
        outOfStock: 'Nedostupno',
            available: 'Dostupno',
                unavailable: 'Nedostupno'
    },

    // Loading states
    loading: {
        addons: 'Učitavanje priloga...',
            products: 'Učitavanje proizvoda...',
                saving: 'Čuvanje...'
    },

    // Buttons
    buttons: {
        cancel: 'Otkaži',
            saveAddons: 'Sačuvaj Priloge',
                saving: 'Čuvanje...'
    },

    // Counter texts
    counters: {
        selectedProducts: '{count} odabranih proizvoda',
            availableProducts: '{count} dostupnih proizvoda'
    },

    // Error messages
    errors: {
        loadingData: 'Došlo je do greške prilikom učitavanja podataka o prilozima.',
            updatingAddon: 'Došlo je do greške prilikom ažuriranja priloga.',
                deletingAddon: 'Došlo je do greške prilikom brisanja priloga.',
                    savingOrder: 'Došlo je do greške prilikom čuvanja redoslijeda priloga.',
                        savingAddons: 'Došlo je do greške prilikom čuvanja priloga. Molimo pokušajte ponovo.',
                            general: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo.',
                                networkError: 'Greška mrežne veze. Provjerite svoju vezu i pokušajte ponovo.'
    },

    // Success messages
    success: {
        addonsSaved: 'Prilozi proizvoda uspješno sačuvani',
            orderUpdated: 'Redoslijed priloga uspješno ažuriran',
                addonUpdated: 'Prilog uspješno ažuriran',
                    addonRemoved: 'Prilog uspješno uklonjen'
    },

    // Accessibility
    accessibility: {
        closeModal: 'Zatvori prozor za priloge proizvoda',
            dragHandle: 'Povucite za promjenu redoslijeda priloga',
                editAddon: 'Uredi detalje priloga',
                    removeAddon: 'Ukloni prilog sa proizvoda',
                        selectProduct: 'Odaberi proizvod kao prilog',
                            productImage: 'Slika proizvoda',
                                toggleRecommended: 'Promijeni status preporuke'
    }
},
editCategoryModal: {
    // Header
    title: 'Uredi Kategoriju',
        subtitle: 'Ažuriraj informacije o kategoriji',
            close: 'Zatvori',

                // Form fields
                form: {
        categoryName: {
            label: 'Ime Kategorije',
                placeholder: 'Unesite ime kategorije...',
                    required: 'Ime kategorije je obavezno',
                        minLength: 'Ime kategorije mora imati najmanje 2 znaka',
                            maxLength: 'Ime kategorije mora imati manje od 100 znakova'
        },
        description: {
            label: 'Opis',
                placeholder: 'Unesite opis kategorije...',
                    optional: 'Opcionalno',
                        maxLength: 'Opis mora imati manje od 500 znakova'
        },
        status: {
            label: 'Aktivno',
                description: 'Kategorija će biti vidljiva u meniju kada je aktivna',
                    active: 'Aktivno',
                        inactive: 'Neaktivno'
        }
    },

    // Buttons
    buttons: {
        cancel: 'Otkaži',
            save: 'Sačuvaj',
                saving: 'Čuvanje...',
                    update: 'Ažuriraj Kategoriju',
                        updating: 'Ažuriranje...'
    },

    // Error messages
    errors: {
        updateFailed: 'Došlo je do greške prilikom ažuriranja kategorije. Molimo pokušajte ponovo.',
            nameRequired: 'Ime kategorije je obavezno',
                nameMinLength: 'Ime kategorije mora imati najmanje 2 znaka',
                    nameMaxLength: 'Ime kategorije mora imati manje od 100 znakova',
                        descriptionMaxLength: 'Opis mora imati manje od 500 znakova',
                            general: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo.',
                                networkError: 'Greška mrežne veze. Provjerite svoju vezu i pokušajte ponovo.',
                                    serverError: 'Došlo je do greške na serveru. Molimo pokušajte kasnije.'
    },

    // Success messages
    success: {
        categoryUpdated: 'Kategorija uspješno ažurirana',
            changesSaved: 'Promjene uspješno sačuvane'
    },

    // Validation messages
    validation: {
        nameRequired: 'Molimo unesite ime kategorije',
            nameMinLength: 'Ime kategorije je prekratko',
                nameMaxLength: 'Ime kategorije je predugo',
                    descriptionMaxLength: 'Opis je predug'
    },

    // Accessibility
    accessibility: {
        closeModal: 'Zatvori prozor za uređivanje kategorije',
            formTitle: 'Forma za uređivanje kategorije',
                requiredField: 'Obavezno polje',
                    optionalField: 'Opcionalno polje',
                        statusToggle: 'Promijeni status kategorije',
                            nameInput: 'Unos imena kategorije',
                                descriptionInput: 'Unos opisa kategorije'
    }
},
confirmDeleteModal: {
    // Common titles (can be overridden by props)
    defaultTitle: 'Potvrdite Brisanje',
        deleteTitle: 'Izbriši Stavku',
            deleteTableWarning: "Uvjerite se da nema zahtjeva na čekanju prije brisanja stola.",
                warning: 'Ova radnja se ne može poništiti. Stavka će biti trajno izbrisana.',

                    // Item types
                    itemTypes: {
        category: 'Kategorija',
            product: 'Proizvod',
                addon: 'Prilog',
                    user: 'Korisnik',
                        order: 'Narudžba',
                            coupon: 'Kupon',
                                discount: 'Popust',
                                    promotion: 'Promocija',
                                        review: 'Recenzija',
                                            comment: 'Komentar',
                                                image: 'Slika',
                                                    file: 'Fajl',
                                                        item: 'Stavka'
    },

    // Buttons
    buttons: {
        cancel: 'Otkaži',
            delete: 'Izbriši',
                deleting: 'Brisanje...',
                    confirm: 'Potvrdi',
                        confirming: 'Potvrđivanje...'
    },

    // Pre-built messages for common scenarios
    messages: {
        category: 'Jeste li sigurni da želite izbrisati ovu kategoriju? Svi proizvodi u ovoj kategoriji također će biti pogođeni.',
            product: 'Jeste li sigurni da želite izbrisati ovaj proizvod? Ova radnja se ne može poništiti.',
                addon: 'Jeste li sigurni da želite izbrisati ovaj prilog? Bit će uklonjen sa svih povezanih proizvoda.',
                    user: 'Jeste li sigurni da želite izbrisati ovog korisnika? Svi njegovi podaci bit će trajno uklonjeni.',
                        general: 'Jeste li sigurni da želite izbrisati ovu stavku? Ova radnja se ne može poništiti.'
    },

    // Error messages
    errors: {
        deleteFailed: 'Došlo je do greške prilikom brisanja. Molimo pokušajte ponovo.',
            networkError: 'Greška mrežne veze. Molimo provjerite svoju vezu i pokušajte ponovo.',
                serverError: 'Došlo je do greške na serveru. Molimo pokušajte kasnije.',
                    permissionError: 'Nemate dozvolu za brisanje ove stavke.',
                        notFound: 'Stavka za brisanje nije pronađena.',
                            hasRelations: 'Nije moguće izbrisati ovu stavku jer ima povezane podatke.',
                                general: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo.'
    },

    // Success messages
    success: {
        deleted: 'Stavka uspješno izbrisana',
            categoryDeleted: 'Kategorija uspješno izbrisana',
                productDeleted: 'Proizvod uspješno izbrisan',
                    addonDeleted: 'Prilog uspješno izbrisan'
    },

    // Confirmation prompts
    confirmations: {
        typeToConfirm: 'Unesite "BRISANJE" za potvrdu',
            enterName: 'Unesite ime za potvrdu brisanja',
                areYouSure: 'Jeste li apsolutno sigurni?',
                    lastChance: 'Ovo je vaša posljednja prilika za otkazivanje.'
    },

    // Accessibility
    accessibility: {
        closeModal: 'Zatvori prozor za potvrdu brisanja',
            deleteDialog: 'Dijalog za potvrdu brisanja',
                warningIcon: 'Ikona upozorenja',
                    deleteButton: 'Potvrdi brisanje',
                        cancelButton: 'Otkaži brisanje',
                            errorAlert: 'Poruka o grešci'
    }
},

editProductModal: {
    // Header
    title: 'Uredi Proizvod',
        subtitle: 'Ažuriraj informacije o proizvodu',
            close: 'Zatvori',

                // Form fields
                form: {
        productImage: {
            label: 'Slika Proizvoda',
                optional: 'Opcionalno'
        },
        productName: {
            label: 'Ime Proizvoda',
                placeholder: 'npr: Margarita Pizza',
                    required: 'Ime proizvoda je obavezno'
        },
        description: {
            label: 'Opis',
                placeholder: 'Opis proizvoda...',
                    optional: 'Opcionalno'
        },
        price: {
            label: 'Cijena',
                placeholder: '0',
                    required: 'Cijena je obavezna',
                        currency: ''
        },
        category: {
            label: 'Kategorija',
                placeholder: 'Odaberi kategoriju',
                    required: 'Odabir kategorije je obavezan'
        },
        status: {
            label: 'Aktivno',
                description: 'Proizvod će biti vidljiv u meniju kada je Aktivan',
                    available: 'Aktivno',
                        unavailable: 'Neaktivno'
        }
    },

    // Buttons
    buttons: {
        cancel: 'Otkaži',
            update: 'Ažuriraj Proizvod',
                updating: 'Ažuriranje...',
                    save: 'Sačuvaj Promjene',
                        saving: 'Čuvanje...',
                            uploading: 'Učitavanje Slike...'
    },

    // Image upload
    imageUpload: {
        clickToUpload: 'Kliknite za učitavanje slike',
            dragToUpload: 'Povucite sliku ovdje ili kliknite za učitavanje',
                dragActive: 'Ispustite fajl ovdje',
                    supportedFormats: 'PNG, JPG, GIF',
                        maxSize: '5MB max',
                            preview: 'Pregled slike',
                                remove: 'Ukloni sliku',
                                    changeImage: 'Promijeni sliku'
    },

    // Error messages
    errors: {
        errorLabel: 'Greška:',
            updateFailed: 'Došlo je do greške prilikom ažuriranja proizvoda. Molimo pokušajte ponovo.',
                nameRequired: 'Ime proizvoda je obavezno',
                    nameAlreadyExists: 'Proizvod sa ovim imenom već postoji. Molimo odaberite drugo ime.',
                        descriptionRequired: 'Opis proizvoda je obavezan',
                            priceRequired: 'Cijena je obavezna',
                                priceMustBePositive: 'Cijena mora biti veća od 0',
                                    categoryRequired: 'Odabir kategorije je obavezan',
                                        imageInvalid: 'Molimo odaberite ispravan fajl slike',
                                            imageTooLarge: 'Veličina fajla slike mora biti manja od 5MB',
                                                imageUploadFailed: 'Neuspjelo učitavanje slike',
                                                    productNotFound: 'Proizvod nije pronađen',
                                                        permissionDenied: 'Nemate dozvolu za ažuriranje ovog proizvoda',
                                                            networkError: 'Greška mrežne veze. Provjerite svoju vezu i pokušajte ponovo.',
                                                                serverError: 'Došlo je do greške na serveru. Molimo pokušajte kasnije.',
                                                                    unknownError: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo.'
    },

    // Success messages
    success: {
        productUpdated: 'Proizvod uspješno ažuriran',
            changesSaved: 'Promjene uspješno sačuvane',
                imageUploaded: 'Slika uspješno učitana'
    },

    // Validation messages
    validation: {
        nameMinLength: 'Ime proizvoda mora imati više od 2 znaka',
            nameMaxLength: 'Ime proizvoda mora imati manje od 100 znakova',
                descriptionMaxLength: 'Opis mora imati manje od 500 znakova',
                    priceMin: 'Cijena mora biti veća od 0',
                        priceMax: 'Cijena mora biti manja od 10000',
                            imageSize: 'Slika mora biti manja od 5MB',
                                imageType: 'Dozvoljeni su samo fajlovi slika'
    },

    // Accessibility
    accessibility: {
        closeModal: 'Zatvori prozor za uređivanje proizvoda',
            formTitle: 'Forma za uređivanje proizvoda',
                requiredField: 'Obavezno polje',
                    optionalField: 'Opcionalno polje',
                        imageUpload: 'Učitaj sliku proizvoda',
                            removeImage: 'Ukloni sliku proizvoda',
                                priceInput: 'Unesite cijenu proizvoda',
                                    categorySelect: 'Odaberite kategoriju proizvoda',
                                        statusToggle: 'Promijeni dostupnost proizvoda',
                                            imagePreview: 'Pregled slike proizvoda'
    }
},

productIngredientModal: {
    // Header
    title: 'Sastojci Proizvoda',
        subtitle: 'odaberi sastojke za',
            close: 'Zatvori',

                // Search
                search: {
        placeholder: 'Pretraži sastojke...',
            label: 'Pretraži sastojke',
                noResults: 'Nema pronađenih sastojaka'
    },

    // Summary section
    summary: {
        selectedCount: 'Odabranih sastojaka',
            hasChanges: 'Ima promjena',
                noChanges: 'Nema promjena'
    },

    // Form fields
    form: {
        quantity: {
            label: 'Količina',
                placeholder: 'Iznos',
                    required: 'Količina je obavezna'
        },
        unit: {
            label: 'Jedinica',
                placeholder: 'Odaberi jedinicu',
                    required: 'Jedinica je obavezna'
        }
    },

    // Measurement units
    units: {
        grams: 'g',
            milliliters: 'ml',
                pieces: 'komad',
                    tablespoons: 'kašika',
                        teaspoons: 'kašičica',
                            cups: 'šolja',
                                kilograms: 'kg',
                                    liters: 'l'
    },

    // Status indicators
    status: {
        available: 'Dostupno',
            unavailable: 'Nedostupno',
                containsAllergens: 'Sadrži Alergene',
                    toBeAdded: 'Za dodati',
                        toBeRemoved: 'Za ukloniti',
                            selected: 'Odabrano',
                                unselected: 'Neodabrano'
    },

    // Allergen information
    allergenInfo: {
        count: '{{count}} alergen',
            count_plural: '{{count}} alergena',
                details: 'Detalji alergena',
                    warning: 'Ovaj sastojak sadrži alergene'
    },

    // Loading states
    loading: {
        ingredients: 'Učitavanje sastojaka...',
            saving: 'Čuvanje sastojaka...',
                data: 'Učitavanje podataka...'
    },

    // Empty states
    emptyState: {
        noIngredients: 'Još nema dodanih sastojaka.',
            noSearchResults: 'Nema pronađenih sastojaka koji odgovaraju kriterijima pretrage.',
                noAvailableIngredients: 'Nema pronađenih dostupnih sastojaka.'
    },

    // Buttons
    buttons: {
        cancel: 'Otkaži',
            skip: 'Preskoči',
                save: 'Sačuvaj',
                    saveIngredients: 'Sačuvaj Sastojke',
                        saving: 'Čuvanje...',
                            add: 'Dodaj Sastojke',
                                update: 'Ažuriraj Sastojke'
    },

    // Footer
    footer: {
        totalCount: 'Ukupno: {{count}} sastojaka',
            selectedInfo: '{{selected}} od {{total}} odabrano'
    },

    // Error messages
    errors: {
        loadingData: 'Došlo je do greške prilikom učitavanja podataka o sastojcima.',
            savingIngredients: 'Došlo je do greške prilikom čuvanja sastojaka. Molimo pokušajte ponovo.',
                quantityRequired: 'Svi sastojci moraju imati količinu veću od 0.',
                    unitRequired: 'Svi sastojci moraju imati odabranu jedinicu.',
                        networkError: 'Greška mrežne veze. Provjerite svoju vezu i pokušajte ponovo.',
                            serverError: 'Došlo je do greške na serveru. Molimo pokušajte kasnije.',
                                general: 'Došlo je do neočekivane greške. Molimo pokušajte ponovo.',
                                    invalidQuantity: 'Molimo unesite ispravnu količinu',
                                        ingredientNotFound: 'Sastojak nije pronađen',
                                            permissionDenied: 'Nemate dozvolu za izmjenu sastojaka'
    },

    // Success messages
    success: {
        ingredientsSaved: 'Sastojci uspješno sačuvani',
            ingredientsUpdated: 'Sastojci uspješno ažurirani',
                ingredientAdded: 'Sastojak uspješno dodan',
                    ingredientRemoved: 'Sastojak uspješno uklonjen'
    },

    // Validation messages
    validation: {
        quantityMin: 'Količina mora biti veća od 0',
            quantityMax: 'Količina mora biti manja od 1000',
                unitRequired: 'Molimo odaberite jedinicu',
                    ingredientRequired: 'Molimo odaberite barem jedan sastojak'
    },

    // Accessibility
    accessibility: {
        closeModal: 'Zatvori prozor za odabir sastojaka',
            searchInput: 'Pretraži sastojke',
                quantityInput: 'Unesite količinu sastojka',
                    unitSelect: 'Odaberite mjernu jedinicu',
                        ingredientCheckbox: 'Odaberi sastojak',
                            selectedIndicator: 'Sastojak odabran',
                                allergenWarning: 'Sadrži alergene',
                                    availabilityStatus: 'Status dostupnosti'
    }
},

ProductIngredientUpdateModal: {
    title: 'Ažuriraj Sastojke',
        searchPlaceholder: 'Pretraži sastojke...',
            selectedCount: 'sastojaka odabrano',
                loadingIngredients: 'Učitavanje sastojaka...',
                    noIngredientsFound: 'Nema pronađenih sastojaka',
                        noIngredientsFoundSearch: 'Nema pronađenih sastojaka koji odgovaraju kriterijima pretrage',
                            unit: 'Jedinica:',
                                price: 'Cijena:',
                                    quantity: 'Količina',
                                        cancel: 'Otkaži',
                                            save: 'Sačuvaj',
                                                saving: 'Čuvanje...',
                                                    errors: {
        loadingIngredients: 'Došlo je do greške prilikom učitavanja sastojaka',
            savingIngredients: 'Došlo je do greške prilikom čuvanja sastojaka'
    },
    accessibility: {
        closeModal: 'Zatvori prozor za ažuriranje sastojaka',
            formTitle: 'Forma za ažuriranje sastojaka proizvoda',
                searchInput: 'Pretraži sastojke',
                    ingredientToggle: 'Promijeni odabir sastojka',
                        quantityInput: 'Unesite količinu sastojka',
                            selectedIndicator: 'Sastojak odabran',
                                unselectedIndicator: 'Sastojak nije odabran',
                                    ingredientCard: 'Kartica za odabir sastojka',
                                        saveButton: 'Sačuvaj promjene sastojaka',
                                            cancelButton: 'Otkaži ažuriranje sastojaka'
    }
},

SortableCategory: {
    product: 'proizvod',
        products: 'proizvodi',
            extras: 'Dodaci',
                loadingExtras: 'Učitavanje dodataka...',
                    status : {
        active: "aktivno",
            inactive : "neaktivno"
    },
    editCategory: 'Uredi kategoriju',
        deleteCategory: 'Izbriši kategoriju',
            editProduct: 'Uredi Proizvod',
                deleteProduct: 'Izbriši Proizvod',
                    manageAddons: 'Upravljaj Prilozima',
                        reorderingProducts: 'Čuvanje redoslijeda proizvoda...',
                            noCategoryProducts: 'Još nema proizvoda u ovoj kategoriji.',
                                expandCategory: 'Proširi kategoriju',
                                    collapseCategory: 'Sažmi kategoriju',
                                        dragCategory: 'Povuci za preuređivanje kategorije',
                                            accessibility: {
        categoryActions: 'Radnje kategorije',
            productCount: 'Broj proizvoda',
                expandToggle: 'Promijeni proširenje kategorije',
                    editCategoryButton: 'Uredi kategoriju',
                        deleteCategoryButton: 'Izbriši kategoriju',
                            dragHandle: 'Ručka za povlačenje za preuređivanje kategorije',
                                categoryCard: 'Kartica kategorije',
                                    emptyCategory: 'Prazna kategorija',
                                        reorderingStatus: 'Kategorija se preuređuje'
    }
},

SortableProduct: {
    outOfStock: 'Nema na stanju',
        loadingIngredients: 'Učitavanje sastojaka...',
            ingredients: 'Sastojci',
                noIngredients: 'Nema dodanih sastojaka',
                    loadingAddons: 'Učitavanje priloga...',
                        addons: 'Prilozi',
                            noAddons: 'Nema dodanih priloga',
                                loadingExtras: 'Učitavanje dodataka...',
                                    extras: 'Dodaci',
                                        noExtras: 'Nema dodanih dodataka',
                                            uncategorized: 'Nekategorisano',
                                                manageExtras: 'Upravljaj dodacima proizvoda',
                                                    manageAddons: 'Upravljaj prilozima',
                                                        editProduct: 'Uredi proizvod',
                                                            deleteProduct: 'Izbriši proizvod',
                                                                manageIngredients: 'Upravljaj sastojcima proizvoda',
                                                                    dragProduct: 'Povuci za preuređivanje proizvoda',
                                                                        allergenic: 'Sadrži alergene',
                                                                            recommended: 'Preporučeno',
                                                                                price: 'Cijena',
                                                                                    buttons: {
        view: 'Vidi',
            addons: 'Prilozi',
                extras: 'Dodaci',
                    ingredients: 'Sastojci',
                        edit: 'Uredi',
                            delete: 'Izbriši',
                                add: 'Dodaj',
                                    remove: 'Ukloni'
    },
    errors: {
        loadingIngredients: 'Došlo je do greške prilikom učitavanja sastojaka.',
            loadingAddons: 'Došlo je do greške prilikom učitavanja priloga.',
                loadingExtras: 'Došlo je do greške prilikom učitavanja dodataka.'
    },
    accessibility: {
        productImage: 'Slika proizvoda',
            productCard: 'Kartica proizvoda',
                productActions: 'Radnje proizvoda',
                    dragHandle: 'Ručka za povlačenje za preuređivanje proizvoda',
                        outOfStockBadge: 'Proizvod nema na stanju',
                            ingredientsList: 'Lista sastojaka proizvoda',
                                addonsList: 'Lista priloga proizvoda',
                                    allergenWarning: 'Sadrži alergene',
                                        recommendedAddon: 'Preporučeni prilog',
                                            editButton: 'Uredi proizvod',
                                                deleteButton: 'Izbriši proizvod',
                                                    addonsButton: 'Upravljaj prilozima proizvoda'
    }
},

IngredientsContent: {
    // Search and filters
    searchPlaceholder: 'Pretraži sastojke...',
        filter: 'Filtriraj',
            sort: 'Sortiraj',
                newIngredient: 'Novi Sastojak',
                    applyFilters: 'Primijeni Filtere',
                        clearFilters: 'Očisti Sve Filtere',

                            // Table headers
                            ingredientName: 'Ime Sastojka',
                                status: 'Status',
                                    allergenInfo: 'Informacije o Alergenima',
                                        actions: 'Radnje',

                                            // Status labels
                                            available: 'Dostupno',
                                                unavailable: 'Nedostupno',
                                                    containsAllergens: 'Sadrži Alergene',
                                                        noAllergens: 'Bez Alergena',

                                                            // Actions
                                                            edit: 'Uredi',
                                                                delete: 'Izbriši',

                                                                    // Empty states
                                                                    noIngredientsFound: 'Nema pronađenih sastojaka koji odgovaraju kriterijima pretrage.',
                                                                        noIngredientsYet: 'Još nema dodanih sastojaka.',

                                                                            // Delete modal
                                                                            deleteIngredient: 'Izbriši Sastojak',
                                                                                deleteConfirmMessage: 'Jeste li sigurni da želite izbrisati sastojak "{name}"?',
                                                                                    deleteError: 'Došlo je do greške prilikom brisanja. Molimo pokušajte ponovo.',
                                                                                        cancel: 'Otkaži',
                                                                                            deleting: 'Brisanje...',

                                                                                                // Form modal
                                                                                                editIngredient: 'Uredi Sastojak',
                                                                                                    addNewIngredient: 'Dodaj Novi Sastojak',
                                                                                                        basicInfo: 'Osnovne Informacije',
                                                                                                            ingredientNameRequired: 'Ime sastojka je obavezno',
                                                                                                                enterIngredientName: 'Unesite ime sastojka',
                                                                                                                    containsAllergensCheckbox: 'Sadrži Alergene',
                                                                                                                        availableForUse: 'vidljivo',
                                                                                                                            allergenInfoContent: 'Informacije o Alergenima',
                                                                                                                                selectAllergensMessage: 'Odaberite alergene sadržane u ovom sastojku:',
                                                                                                                                    enableAllergenMessage: 'Prvo označite "Sadrži Alergene" da biste odabrali alergene.',
                                                                                                                                        allergenDetails: 'Detalji Alergena',
                                                                                                                                            containsThisAllergen: 'Sadrži ovaj alergen',
additionalNotes: 'Dodatne napomene (opcionalno)',
    updateError: 'Došlo je do greške prilikom ažuriranja sastojka.',
        createError: 'Došlo je do greške prilikom dodavanja sastojka.',
            updating: 'Ažuriranje...',
                adding: 'Dodavanje...',
                    update: 'Ažuriraj',
                        add: 'Dodaj',

                            accessibility: {
    ingredientsTable: 'Tabela upravljanja sastojcima',
        searchInput: 'Pretraži sastojke',
            filterButton: 'Filtriraj sastojke',
                sortButton: 'Sortiraj sastojke',
                    addButton: 'Dodaj novi sastojak',
                        editButton: 'Uredi sastojak',
                            deleteButton: 'Izbriši sastojak',
                                ingredientCard: 'Kartica sa informacijama o sastojku',
                                    allergenSelection: 'Odabir alergena',
                                        formModal: 'Prozor forme sastojka',
                                            deleteModal: 'Prozor potvrde brisanja',
                                                statusBadge: 'Status sastojka',
                                                    allergenBadge: 'Informacije o alergenima',
                                                        closeModal: 'Zatvori prozor',
                                                            dragToReorder: 'Povuci za preuređivanje'
}
  },

TableCard: {
    active: 'Aktivno',
        inactive: 'Neaktivno',
            occupied: 'Zauzeto',
                empty: 'Prazno',
                    capacity: 'Osoba',
                        capacityPlural: 'Osoba',
                            edit: 'Uredi',
                                downloadQR: 'Preuzmi QR Kod',
                                    disable: 'Onemogući',
                                        enable: 'Aktiviraj',
                                            delete: 'Izbriši',
                                                viewQRCode: 'Vidi QR Kod',
                                                    moreOptions: 'Više opcija',
                                                        accessibility: {
        tableCard: 'Kartica informacija o stolu',
            statusBadge: 'Status stola',
                occupancyBadge: 'Status zauzetosti stola',
                    actionsMenu: 'Meni radnji za stolom',
                        qrCodePreview: 'Pregled QR koda',
                            editButton: 'Uredi stol',
                                downloadButton: 'Preuzmi QR kod',
                                    toggleButton: 'Promijeni status stola',
                                        deleteButton: 'Izbriši stol'
    }
},

QRCodeModal: {
    // Step selection
    tableAddOption: 'Opcija Dodavanja Stola',
        howToAddTables: 'Kako biste željeli dodati stolove?',
            singleTable: 'Dodaj Jedan Stol',
                bulkTable: 'Dodaj Više Stolova',
                    createSingleTable: 'Kreiraj jedan stol',
                        createMultipleTables: 'Kreiraj više stolova',

                            // Branch selection
                            branchSelection: 'Odabir Filijale',
                                selectBranch: 'Odaberi Filijalu',
                                    branchRequired: 'Obavezno',
                                        loadingBranches: 'Učitavanje filijala...',

                                            // Single table form
                                            editTable: 'Uredi Stol',
                                                addSingleTable: 'Dodaj Jedan Stol',
                                                    tableName: 'Ime Stola',
                                                        tableNamePlaceholder: 'npr. Stol 1',
                                                            autoNameNote: 'Automatsko ime će biti dodijeljeno ako ostane prazno',
                                                                tableCategory: 'Područje Stola',
                                                                    selectCategory: 'Odaberi Područje',
                                                                        loadingCategories: 'Učitavanje Područja...',
                                                                            noCategories: 'Područje nije pronađeno',
                                                                                capacity: 'Kapacitet',
                                                                                    capacityPlaceholder: 'Broj osoba',
                                                                                        displayOrder: 'Redoslijed Prikaza',
                                                                                            displayOrderPlaceholder: 'Broj za redoslijed',
                                                                                                autoOrderNote: 'Automatski redoslijed će biti primijenjen ako ostane prazno',
                                                                                                    tableActive: 'Stol treba biti aktivan',

                                                                                                        // Bulk table form
                                                                                                        addBulkTables: 'Dodaj Više Stolova',
                                                                                                            categoryQuantities: 'Količine Stolova po Kategorijama',
                                                                                                                addCategory: 'Dodaj Kategoriju',
                                                                                                                    category: 'Kategorija',
                                                                                                                        tableCount: 'Broj Stolova',
                                                                                                                            allTablesActive: 'Svi stolovi trebaju biti aktivni',
                                                                                                                                tableSummary: 'Sažetak stolova za kreiranje:',
                                                                                                                                    total: 'Ukupno',
                                                                                                                                        tables: 'stolova',

                                                                                                                                            // Actions
                                                                                                                                            cancel: 'Otkaži',
                                                                                                                                                adding: 'Dodavanje...',
                                                                                                                                                    addTable: 'Dodaj Stol',
                                                                                                                                                        update: 'Ažuriraj',
                                                                                                                                                            updating: 'Ažuriranje...',
                                                                                                                                                                creating: 'Kreiranje... ({count} stolova)',
                                                                                                                                                                    createTables: '{count} Kreiraj Stolove',

                                                                                                                                                                        // Validation
                                                                                                                                                                        branchRequiredValidation: 'Odabir filijale je obavezan',
                                                                                                                                                                            categoryRequired: 'Najmanje jedno Područje je obavezno',

                                                                                                                                                                                accessibility: {
        modal: 'Prozor za kreiranje stolova',
            stepSelection: 'Odabir metode kreiranja stolova',
                branchSelector: 'Padajući meni za odabir filijale',
                    categorySelector: 'Odabir Područja stola',
                        tableForm: 'Forma za kreiranje stola',
                            bulkForm: 'Forma za masovno kreiranje stolova',
                                backButton: 'Vrati se na prethodni korak',
                                    closeButton: 'Zatvori prozor'
    }
},

TableCategoryModal: {
    addCategoryTitle: 'Dodaj Novo Područje',

        editCategoryTitle: 'Uredi Područje',
            update: 'Ažuriraj Područje',
                addCategorySubtitle: 'Kreirajte novo područje za vaše stolove',
                    editCategorySubtitle: 'Ažurirajte detalje područja',
                        categoryName: 'Ime Područja',
                            categoryNamePlaceholder: 'Unesite ime područja',
                                description: 'Opis',
                                    descriptionPlaceholder: 'Unesite opis (opcionalno)',
                                        colorSelection: 'Odabir Boje',
                                            customColor: 'Prilagođena boja',
                                                iconSelection: 'Tip Područja',
                                                    branchSelection: 'Odabir Filijale',
                                                        cancel: 'Otkaži',
                                                            addCategory: 'Dodaj Područje',
                                                                saving: 'Čuvanje...',

                                                                    // Icons
                                                                    table: 'Stol',
                                                                        chair: 'Stolica',
                                                                            service: 'Usluga',
                                                                                label: 'Oznaka',
                                                                                    layer: 'Sloj',

                                                                                        // Validation errors
                                                                                        categoryNameRequired: 'Ime područja je obavezno',
                                                                                            iconRequired: 'Ikona je obavezna',
                                                                                                branchRequired: 'Odabir filijale je obavezan',
                                                                                                    invalidData: 'Pruženi su nevažeći podaci',
                                                                                                        errorOccurred: 'Došlo je do greške',
                                                                                                            unauthorized: 'Niste ovlašteni. Molimo prijavite se ponovo.',
                                                                                                                forbidden: 'Nemate dozvolu za ovu operaciju.',
                                                                                                                    branchNotFound: 'Odabrana filijala nije pronađena.',
                                                                                                                        serverError: 'Došlo je do greške na serveru. Molimo pokušajte kasnije.',
                                                                                                                            unexpectedError: 'Došlo je do neočekivane greške prilikom dodavanja kategorije',

                                                                                                                                accessibility: {
        modal: 'Prozor Područja Stolova',
            close: 'Zatvori',
                colorPalette: 'Paleta za odabir boje',
                    colorPreset: 'Unaprijed postavljena opcija boje',
                        customColorPicker: 'Birač prilagođene boje',
                            iconGrid: 'Mreža za odabir ikona',
                                iconOption: 'Opcija odabira ikone',
                                    branchDropdown: 'Padajući meni za odabir filijale',
                                        form: 'Forma za kreiranje područja'
    }
},

AddQRCodeCard: {
    title: 'Dodaj Novi Stol',
        subtitle: 'Kliknite da dodate novi stol',
            accessibility: {
        addButton: 'Dugme za dodavanje novog stola',
            addCard: 'Kartica za dodavanje novog stola'
    }
},

userManagementPage: {
    systemRoleInfo: "Ne možete vršiti izmjene na ovome",
        rolePermissionsModal: {
        title: "Pregled Dozvola",
            noPermissions: "Nema Dozvola"
    },

    editRole: {
        title: "Uređivanje Uloge",
            save: "Sačuvaj"
    },
    confirmation: {
        deleteRoleTitle: "Izbriši Ulogu",
            activateTitle: "Aktiviraj Korisnika?",
                activateMessage: "Jeste li sigurni da želite aktivirati {name}?",
                    deleteRoleMessage: "Jeste li sigurni da želite izbrisati ovu ulogu? Ova radnja se ne može poništiti.",
                        deactivateTitle: "Deaktiviraj Korisnika?",
                            deactivateMessage: "Jeste li sigurni da želite deaktivirati {name}? Izgubit će pristup sistemu."

    },
    title: 'Upravljanje Korisnicima',
        loading: 'Učitavanje...',
            error: {
        title: 'Greška',
            loadFailed: 'Neuspjelo učitavanje korisnika',
                rolesLoadFailed: 'Neuspjelo učitavanje uloga',
                    retry: 'Pokušaj Ponovo',
                        createUserFailed: 'Neuspjelo kreiranje korisnika',
                            createRoleFailed: 'Neuspjelo kreiranje uloge',
                                "changePasswordFailed": "Neuspjela promjena lozinke",
                                    "assignBranchFailed": "Neuspjelo dodjeljivanje filijale"
    },

    "changePasswordModal": {
        "title": "Promijeni Lozinku",
            "info": "Unesite novu lozinku za ovog korisnika. Moći će se prijaviti sa ovom novom lozinkom.",
                "newPassword": "Nova Lozinka",
                    "newPasswordPlaceholder": "Unesite novu lozinku",
                        "confirmPassword": "Potvrdi Lozinku",
                            "confirmPasswordPlaceholder": "Potvrdite novu lozinku",
                                "requirements": "Zahtjevi za Lozinku:",
                                    "minLength": "Najmanje 6 znakova",
                                        "passwordsMatch": "Lozinke se podudaraju",
                                            "submit": "Promijeni Lozinku",
                                                "cancel": "Otkaži",
                                                    currentPassword: "Trenutna Lozinka",
                                                        currentPasswordPlaceholder: "Unesite svoju trenutnu lozinku",
                                                            currentPasswordEntered: "Trenutna lozinka",
                                                                "changing": "Mijenjanje...",
                                                                    "validation": {
            "passwordRequired": "Lozinka je obavezna",
                "passwordMinLength": "Lozinka mora imati najmanje 6 znakova",
                    "confirmPasswordRequired": "Molimo potvrdite lozinku",
                        "passwordMismatch": "Lozinke se ne podudaraju"
        }
    },

    "assignBranchModal": {
        "title": "Dodijeli Filijalu",
            "assigningTo": "Dodjeljivanje",
                "selectDestinationType": "Odaberi Tip Opsega",
                    "toNewBranch": "novoj filijali",
                        "currentBranch": "Trenutna Filijala",
                            "assignedToRestaurant": "Nivo Restorana (Sjedište)",
                                "alreadyAtRestaurant": "Već u Sjedištu",
                                    "groupBranches": "Dodijeli Filijali",
                                        "assignToRestaurant": "Dodijeli Restoranu",
                                            "selectBranch": "Odaberi Filijalu",
                                                "selectBranchPlaceholder": "Odaberite filijalu",
                                                    "confirmRestaurantTitle": "Potvrdite Dodjelu Restoranu",
                                                        "confirmRestaurantDesc": "{{name}} će biti uklonjen iz trenutne filijale i premješten na nivo Restorana.",
                                                            "submitButton": "Dodijeli",
                                                                "submitButtonLoading": "Dodjeljivanje...",
                                                                    "validation": {
            "branchRequired": "Molimo odaberite filijalu"
        }
    },

    // Statistics
    stats: {
        total: 'Ukupno',
            active: 'Aktivno',
                users: 'korisnika',
                    roles: 'uloga',
                        system: 'Sistem',
                            custom: 'Prilagođeno',
                                totalUsers: 'Ukupno Korisnika',
                                    owner: 'Vlasnik',
                                        manager: 'Menadžer',
                                            staff: 'Osoblje'
    },

    // Tabs
    tabs: {
        users: 'Korisnici',
            roles: 'Uloge'
    },

    // Controls and filters
    controls: {
        search: 'Pretraži korisnika, email ili telefon...',
            searchRoles: 'Pretraži ulogu, opis ili kategoriju...',
                filterAll: 'Sve Kategorije',
                    filterOwner: 'Vlasnik Restorana',
                        filterManager: 'Menadžer Filijale',
                            filterStaff: 'Osoblje',
                                filterActive: 'Aktivni Korisnici',
                                    filterInactive: 'Neaktivni Korisnici',
                                        addUser: 'Dodaj Korisnika',
                                            addRole: 'Dodaj Ulogu'
    },

    // Table headers
    table: {
        user: 'Korisnik',
            contact: 'Kontakt',
                roles: 'Uloge',
                    location: 'Restoran/Filijala',
                        status: 'Status',
                            registrationDate: 'Datum Registracije',
                                actions: 'Radnje',
                                    role: 'Uloga',
                                        description: 'Opis',
                                            statistics: 'Statistika',
                                                position: 'Lokacija'
    },

    // Status indicators
    status: {
        active: 'Aktivno',
            inactive: 'Neaktivno',
                enabled: 'Omogućeno',
                    disabled: 'Onemogućeno',
                        systemRole: 'Sistemska Uloga'
    },

    // Role types
    roleTypes: {
        RestaurantOwner: 'Vlasnik',
            BranchManager: 'Menadžer',
                Staff: 'Osoblje',
                    SuperAdmin: "Super Admin",
                        BranchStaff: "Osoblje Filijale"
    },
    permissionsModal: {
        title: "Dozvole",
            close: "Zatvori",
                userRoles: "Uloge Korisnika",
                    permissions: "Dozvole",
                        permissionsCount: "Broj",
                            noPermissions: "Nema Dozvola"
    },
    "editUserModal": {
        "title": "Uredi Korisnika",
            "firstNameLabel": "Ime",
                "lastNameLabel": "Prezime",
                    "emailLabel": "Email",
                        "usernameLabel": "Korisničko Ime",
                            "isActiveLabel": "Korisnik je Aktivan",
                                "saveButton": "Sačuvaj Promjene",
                                    "saveButtonLoading": "Čuvanje...",
                                        "validation": {
            "firstNameRequired": "Ime je obavezno",
                "lastNameRequired": "Prezime je obavezno",
                    "emailRequired": "Email je obavezan",
                        "usernameRequired": "Korisničko ime je obavezno"
        }
    },
    // Actions menu
    actions: {
        viewDetails: 'Vidi Detalje',
            edit: 'Uredi',
                activate: 'Aktiviraj',
                    deactivate: 'Deaktiviraj',
                        delete: 'Izbriši',
                            updateRoles: 'Ažuriraj Uloge',
                                assignBranch: 'Dodijeli Filijale',
                                    viewPermissions: "Vidi Dozvole",
                                        "changePassword": "Promijeni Lozinku",
    },



    updateRoles: {
        title: "Ažuriraj Uloge Korisnika",
            update : "Ažuriraj",
    },

    // No results messages
    noResults: {
        usersNotFound: 'Korisnici Nisu Pronađeni',
            rolesNotFound: 'Uloge Nisu Pronađene',
                usersEmpty: 'Još nema dodanih korisnika.',
                    rolesEmpty: 'Još nema dodanih uloga.',
                        searchEmpty: 'Nema pronađenih korisnika koji odgovaraju vašim kriterijima pretrage.',
                            searchEmptyRoles: 'Nema pronađenih uloga koje odgovaraju vašim kriterijima pretrage.'
    },

    // Create Role Modal
    createRole: {
        title: 'Kreiraj Novu Ulogu',
            step1Title: "Korak 1: Osnovne Informacije",
                deselectAll: "Očisti",
                    permissionsRequired: "* Najmanje jedna dozvola je obavezna",
                        step2Title: "Korak 2: Odaberi Dozvole",
                            stepBasicInfo: "Osnovne Info",
                                stepPermissions: "Dozvole",
                                    step1Info: "Kreiraj Ulogu",
                                        step2Info: "Odaberi dozvole korisnika",
                                            step1Description: "Unesite osnovne informacije za novu ulogu",
                                                roleCreatedSuccess: "Uloga Uspješno Kreirana!",
                                                    step2Description: "Sada možete odabrati dozvole za ovu ulogu",
      continue: "Nastavi na Dozvole",
            back: "Nazad",
                clear: "Očisti",
                    skipPermissions: "Preskoči (Dodaj Kasnije)",
                        finish: "Završi",
                            creating: "Kreiranje...",
                                saving: "Čuvanje...",
                                    loadingPermissions: "Učitavanje dozvola...",
                                        basicInfo: 'Osnovne Informacije',
                                            noBranch: 'Nema Dodjele Filijale',
                                                branch: 'Dodjela Restorana i Filijale',
                                                    selectBranch: 'Odaberi Filijale',
                                                        branchHint: 'Ako nije odabrana filijala, uloga će se primijeniti na sve filijale restorana.',
                                                            selectAll: 'Odaberi Sve',
                                                                roleName: 'Ime Uloge',
                                                                    roleNamePlaceholder: 'npr.: Menadžer Filijale',
                                                                        category: 'Kategorija',
                                                                            categoryPlaceholder: 'npr.: Upravljanje',
                                                                                description: 'Opis',
                                                                                    descriptionPlaceholder: 'Opišite dužnosti i odgovornosti uloge...',
                                                                                        restaurantId: 'ID Restorana',
                                                                                            restaurantIdPlaceholder: 'Zadano: Trenutni restoran',
                                                                                                branchId: 'ID Filijale',
                                                                                                    branchIdPlaceholder: 'Prazno: Sve filijale',
                                                                                                        isActive: 'Uloga treba biti aktivna',
                                                                                                            permissions: 'Dozvole',
                                                                                                                permissionsSelected: 'odabrano',
                                                                                                                    cancel: 'Otkaži',
                                                                                                                        create: 'Kreiraj Ulogu',
                                                                                                                            validation: {
            nameRequired: 'Ime uloge mora imati najmanje 3 znaka',
                nameMaxLength: 'Ime uloge može imati najviše 50 znakova',
                    descriptionMaxLength: 'Opis može imati najviše 200 znakova',
                        categoryMaxLength: 'Kategorija može imati najviše 50 znakova'
        }
    },

    // Create User Modal
    createUser: {
        title: 'Kreiraj Novog Korisnika',
            selectBranch: 'Odaberi Filijalu',
                personalInfo: 'Lične Informacije',
                    contactInfo: 'Kontakt Informacije',
                        passwordInfo: 'Informacije o Lozinci',
                            locationInfo: 'Informacije o Lokaciji',
                                roleAssignment: 'Ovlaštenje i Dodjela Uloge',
                                    phoneNumber: 'Broj Telefona',
                                        confirmPassword: 'Potvrdi Lozinku',
                                            location: 'Lokacija Restorana/Filijale',
                                                roles: 'Uloge',
                                                    fullNumber: "Puni Broj ",
                                                        userIsActive: 'Korisnik je Aktivan',
                                                            // Form fields
                                                            firstName: 'Ime',
                                                                firstNamePlaceholder: 'npr.: John',
                                                                    lastName: 'Prezime',
                                                                        lastNamePlaceholder: 'npr.: Doe',
                                                                            userName: 'Korisničko Ime',
                                                                                userNamePlaceholder: 'Bit će automatski generisano',
                                                                                    userNameHint: 'Ako ostane prazno, automatski će biti kreirano u formatu ime.prezime',
                                                                                        email: 'Email',
                                                                                            emailPlaceholder: 'john@primjer.com',
                                                                                                phone: 'Telefon',
                                                                                                    phonePlaceholder: '+1 555 123 4567',
                                                                                                        password: 'Lozinka',
                                                                                                            passwordPlaceholder: 'Najmanje 6 znakova',
                                                                                                                passwordConfirm: 'Potvrdi Lozinku',
                                                                                                                    passwordConfirmPlaceholder: 'Ponovo unesite svoju lozinku',

                                                                                                                        // Location
                                                                                                                        locationType: 'Opseg Korisnika',
                                                                                                                            restaurant: 'Restoran',
                                                                                                                                branch: 'Filijala',
                                                                                                                                    restaurantId: 'ID Restorana',
                                                                                                                                        restaurantIdPlaceholder: 'npr.: 123',
                                                                                                                                            branchId: 'ID Filijale',
                                                                                                                                                branchIdPlaceholder: 'npr.: 456',
                                                                                                                                                    profileImage: 'URL Slike Profila',
                                                                                                                                                        profileImagePlaceholder: 'https://primjer.com/avatar.jpg',
                                                                                                                                                            userCreatorId: 'ID Kreatora Korisnika',
                                                                                                                                                                userCreatorIdPlaceholder: 'ID trenutnog korisnika',

                                                                                                                                                                    // Role assignment
                                                                                                                                                                    assignmentType: 'Tip Dodjele',
                                                                                                                                                                        rolesSelection: 'Odaberi iz Postojećih Uloga (Preporučeno)',
                                                                                                                                                                            permissionsSelection: 'Direktan Odabir Dozvola (Trenutno nije podržano)',
                                                                                                                                                                                apiWarning: '⚠️ API podržava samo kreiranje korisnika zasnovano na ulogama. Prvo kreirajte uloge, a zatim ih dodijelite korisnicima.',
                                                                                                                                                                                    rolesLabel: 'Uloge',
                                                                                                                                                                                        rolesSelected: 'odabrano',

                                                                                                                                                                                            // No roles state
                                                                                                                                                                                            noRoles: {
            title: 'Još nema definisanih uloga',
                description: 'Kreirajte uloge iz taba uloge prije kreiranja korisnika',
                    tip: '💡 Savjet: Prvo pređite na tab "Uloge" da biste kreirali potrebne uloge',
                        warning: 'Uloga Obavezna',
                            warningDescription: 'Najmanje jedna uloga mora biti definisana za kreiranje korisnika. Nove uloge možete kreirati iz taba "Uloge".'
        },

        isActive: 'Korisnik treba biti aktivan',
            cancel: 'Otkaži',
                create: 'Kreiraj Korisnika',
                    creating: 'Kreiranje...',
                        createRoleFirst: 'Prvo Kreiraj Ulogu',

// Validation messages,
validation: {
    nameRequired: 'Ime je obavezno',
        nameMaxLength: 'Ime može imati najviše 50 znakova',
            surnameRequired: 'Prezime je obavezno',
                surnameMaxLength: 'Prezime može imati najviše 50 znakova',
                    emailRequired: 'Email je obavezan',
                        emailInvalid: 'Molimo unesite ispravnu email adresu',
                            passwordRequired: 'Lozinka mora imati najmanje 6 znakova',
                                passwordMaxLength: 'Lozinka može imati najviše 100 znakova',
                                    passwordConfirmRequired: 'Potvrda lozinke je obavezna',
                                        passwordMismatch: 'Lozinke se ne podudaraju',
                                            phoneRequired: 'Broj telefona je obavezan',
                                                restaurantIdRequired: 'Molimo unesite ispravan ID restorana',
                                                    branchIdRequired: 'Molimo unesite ispravan ID filijale',
                                                        rolesRequired: 'Morate odabrati najmanje jednu ulogu',
                                                            permissionsNotSupported: 'API podržava samo kreiranje korisnika zasnovano na ulogama. Molimo odaberite iz postojećih uloga.'
}
    },

// Role details
roleDetails: {
    userCount: 'Broj Korisnika',
        permissionCount: 'Broj Dozvola',
            restaurant: 'Restoran',
                branch: 'Filijala',
                    noDescription: 'Opis nije dostupan',
                        created: 'Kreirano',
                            system: 'Sistem',
                                users: 'korisnika',
                                    permissions: 'dozvola',
                                        branchSpecific: 'Specifično za Filijalu',

    },

// Permission categories
permissionCategories: {
    UserManagement: 'Upravljanje Korisnicima',
        RestaurantManagement: 'Upravljanje Restoranom',
            BranchManagement: 'Upravljanje Filijalom',
                OrderManagement: 'Upravljanje Narudžbama',
                    ProductManagement: 'Upravljanje Proizvodima',
                        Analytics: 'Analitika'
},

// Success messages
success: {
    userCreated: 'Korisnik uspješno kreiran',
        roleCreated: 'Uloga uspješno kreirana',
            userUpdated: 'Korisnik uspješno ažuriran',
                roleUpdated: 'Uloga uspješno ažurirana'
},

  },

BranchtableManagement: {
    title: "Upravljanje Stolovima",
        loading : "Učitavanje...",

            batchCreateTables: "batchKreirajStolove",
                subtitle: "Upravljajte stolovima i kategorijama vašeg restorana",
                    tabs: {
        tables: "Stolovi",
            categories: "Kategorije",
                statistics: "Statistika",
                    batchCreate: "Masovno Kreiranje"
    },
    buttons: {
        addTable: "Dodaj Stol",
            addCategory: "Dodaj Područja",
                batchCreate: "Masovno Kreiranje",
                    edit: "Uredi",
                        delete: "Izbriši",
                            save: "Sačuvaj",
                                cancel: "Otkaži",
                                    refresh: "Osvježi",
                                        selectAll: "Odaberi Sve",
                                            clearSelection: "Očisti Odabir",
      export: "Izvezi",
      import: "Uvezi"
    },
    labels: {
        tableName: "Ime Stola",
            category: "Kategorija",
                capacity: "Kapacitet",
                    status: "Status",
                        occupation: "Zauzetost",
                            displayOrder: "Redoslijed Prikaza",
                                search: "Pretraži stolove...",
                                    filterByCategory: "Filtriraj po Kategoriji",
                                        viewMode: "Način Prikaza",
                                            totalTables: "Ukupno Stolova",
                                                activeTables: "Aktivni Stolovi",
                                                    occupiedTables: "Zauzeti Stolovi",
                                                        availableTables: "Dostupni Stolovi"
    },
    status: {
        active: "Aktivno",
            inactive: "Neaktivno",
                occupied: "Zauzeto",
                    available: "Dostupno",
                        outOfService: "Van Upotrebe"
    },
    actions: {
        markOccupied: "Označi kao Zauzeto",
            markAvailable: "Označi kao Dostupno",
                activate: "Aktiviraj",
                    deactivate: "Deaktiviraj",
                        viewDetails: "Vidi Detalje"
    },
    messages: {
        tableCreated: "Stol uspješno kreiran",
            tableUpdated: "Stol uspješno ažuriran",
                tableDeleted: "Stol uspješno izbrisan",
                    statusUpdated: "Status uspješno ažuriran",
                        error: "Došlo je do greške",
                            noTables: "Nema pronađenih stolova",
                                confirmDelete: "Jeste li sigurni da želite izbrisati ovaj stol?",
                                    loading: "Učitavanje...",
                                        saving: "Čuvanje...",
                                            deleting: "Brisanje..."
    },
    statistics: {
        title: "Statistika Stolova",
            occupancyRate: "Stopa Zauzetosti",
                averageCapacity: "Prosječan Kapacitet",
                    categoryBreakdown: "Pregled po Kategorijama",
                        dailyOccupancy: "Dnevna Zauzetost",
                            peakHours: "Najprometniji Sati"
    },
    forms: {
        createTable: "Kreiraj Novi Stol",
            editTable: "Uredi Stol",
                batchCreateTables: "Kreiraj Više Stolova",
                    quantity: "Količina",
                        namePrefix: "Prefiks Imena",
                            startingNumber: "Početni Broj"
    },
},

BranchTableManagement: {
    "capacityLabel": "Kapacitet",
        "tableNameLabel": "Ime Stola",
            header: "Područja i Upravljanje Stolovima",
                "clearTable": "Očisti Stol",
                    "refreshTable": "Osvježi Status",
                        "clearing": "Čišćenje...",
                            loading: "Učitavanje...",
                                category: "Područje",
                                    createTables: "Kreiraj Stolove",
                                        creatingTables: "Kreiranje...",
                                            SelectCategory: "Odaberi Područje",
                                                Capacity: "Kapacitet",
                                                    Quantity: "Količina",
                                                        batchCreateTables: "Masovno Kreiranje Stolova",
                                                            subheader: "Upravljajte Područjima i stolovima restorana sa prikazom harmonike",
                                                                totalCategories: "Ukupno Područja",
                                                                    totalTables: "Ukupno Stolova",
                                                                        occupiedTables: "Zauzeti Stolovi",
                                                                            availableTables: "Dostupni Stolovi",
                                                                                searchPlaceholder: "Pretraži Područja...",
                                                                                    refresh: "Osvježi",
                                                                                        addCategory: "Dodaj Područje",
                                                                                            addCategoryTitle: "Dodaj Novo Područje",
                                                                                                multiCategory: "Kreirajte više stolova u različitim Područjima odjednom",
                                                                                                    categoryNameLabel: "Ime Područja",
                                                                                                        categoryNamePlaceholder: "Unesite ime Područja",
                                                                                                            colorLabel: "Boja",
                                                                                                                iconLabel: "Ikona",
                                                                                                                    save: "Sačuvaj",
                                                                                                                        cancel: "Otkaži",
                                                                                                                            edit: "Uredi",
                                                                                                                                delete: "Izbriši",
                                                                                                                                    qrCode: "QR Kod",
                                                                                                                                        showQRCode: "Prikaži QR Kod",
                                                                                                                                            noCategories: "Nema pronađenih kategorija",
                                                                                                                                                addFirstCategory: "Dodajte Svoje Prvo Područje",
                                                                                                                                                    tablesCount: "stolova",
                                                                                                                                                        status: "Status",
                                                                                                                                                            active: "Aktivno",
                                                                                                                                                                inactive: "Neaktivno",
                                                                                                                                                                    occupation: "Zauzetost",
                                                                                                                                                                        occupied: "Zauzeto",
                                                                                                                                                                            available: "Dostupno",
                                                                                                                                                                                addTable: "Dodaj Stol",
                                                                                                                                                                                    tableNamePlaceholder: "Ime stola",
                                                                                                                                                                                        capacityPlaceholder: "Kapacitet",
                                                                                                                                                                                            noTables: "Nema stolova u ovoj kategoriji",
                                                                                                                                                                                                qrCodeTitle: "QR Kod - {tableName}",
                                                                                                                                                                                                    qrCodeDescription: "Skenirajte ovaj QR kod za pristup meniju stola",
                                                                                                                                                                                                        downloadQR: "Preuzmi QR Kod",
                                                                                                                                                                                                            downloading: "Preuzimanje...",
                                                                                                                                                                                                                copyQRUrl: "Kopiraj QR URL",
                                                                                                                                                                                                                    copied: "Kopirano!",
                                                                                                                                                                                                                        success: {
        "tableCleared": "Stol {{tableName}} je očišćen i sada je dostupan",
            "tableOccupied": "Status stola {{tableName}} je ažuriran na zauzeto",
                "tableClearedGeneric": "Stol je uspješno očišćen",
                    "tableStatusUpdated": "Status stola je uspješno ažuriran",
                        categoryAdded: "Kategorija uspješno dodana",
                            categoryUpdated: "Kategorija uspješno ažurirana",
                                categoryDeleted: "Kategorija uspješno izbrisana",
                                    tableAdded: "Stol uspješno dodan",
                                        tableUpdated: "Stol uspješno ažuriran",
                                            tableDeleted: "Stol uspješno izbrisan",
                                                categoryActivated: "Kategorija uspješno aktivirana",
                                                    categoryDeactivated: "Kategorija uspješno deaktivirana",
                                                        tableActivated: "Stol uspješno aktiviran",
                                                            tableDeactivated: "Stol uspješno deaktiviran",
                                                                tableAvailable: "Stol označen kao dostupan",
                                                                    dataRefreshed: "Podaci uspješno osvježeni"
    },
    error: {
        "clearTableFailed": "Neuspjelo čišćenje stola. Molimo pokušajte ponovo.",
            fetchCategoriesFailed: "Neuspjelo dohvaćanje kategorija",
                fetchTablesFailed: "Neuspjelo dohvaćanje stolova",
                    createCategoryFirst: "Molimo prvo kreirajte kategoriju",
                        categoryNameRequired: "Ime kategorije je obavezno",
                            addCategoryFailed: "Neuspjelo dodavanje kategorije",
                                updateCategoryFailed: "Neuspjelo ažuriranje kategorije",
                                    deleteCategoryFailed: "Neuspjelo brisanje kategorije",
                                        categoryHasTables: "Nije moguće izbrisati kategoriju sa postojećim stolovima",
                                            categoryNotFound: "Kategorija nije pronađena",
                                                addTableFailed: "Neuspjelo dodavanje stola",
                                                    updateTableFailed: "Neuspjelo ažuriranje stola",
                                                        deleteTableFailed: "Neuspjelo brisanje stola",
                                                            tableNameRequired: "Ime stola je obavezno",
                                                                tableNotFound: "Stol nije pronađen",
                                                                    updateCategoryStatusFailed: "Neuspjelo ažuriranje statusa kategorije",
                                                                        updateTableStatusFailed: "Neuspjelo ažuriranje statusa stola",
                                                                            updateTableOccupationFailed: "Neuspjelo ažuriranje zauzetosti stola",
                                                                                refreshFailed: "Neuspjelo osvježavanje podataka"
    }
},

branchManagementBranch: {
    title: 'Upravljanje Filijalom',
        description: 'Upravljajte informacijama i postavkama vaše filijale.',
            loading: 'Učitavanje informacija o filijali...',
                noBranchFound: 'Filijala nije pronađena',
                    uploadLogo: 'Učitaj Logo',
                        editBranchName: 'Uredi Ime Filijale',
                            status: {
        open: 'Otvoreno',
            closed: 'Zatvoreno',
                temporarilyClosed: 'Privremeno Zatvoreno',
                    reopenBranch: 'Ponovo Otvori Filijalu',
                        temporaryClose: 'Privremeno Zatvori'
    },

    actions: {
        edit: 'Uredi',
            save: 'Sačuvaj',
                cancel: 'Otkaži',
                    delete: 'Izbriši',
                        deleting: 'Brisanje...',
                            confirmDelete: 'Potvrdi Brisanje',
                                deleteWarning: 'Jeste li sigurni da želite izbrisati ovu filijalu? Ova radnja se ne može poništiti.',
                                    onlineMenu: 'URL Online Menija',
                                        copyLink: 'Kopiraj Link',
                                            copied: 'Kopirano!',
                                                linkCopied: 'Link kopiran u međuspremnik!',
    },

    basicInfo: {
        title: 'Osnovne Informacije',
            branchName: 'Ime Filijale',
                whatsappNumber: 'WhatsApp Broj',
                    email: 'Email',
                        notSpecified: 'Nije navedeno'
    },

    addressInfo: {
        title: 'Informacije o Adresi',
            country: 'Država',
                city: 'Grad',
                    street: 'Ulica',
                        postalCode: 'Poštanski Broj',
                            region: 'Regija'
    },

    workingHours: {
        title: 'Radno Vrijeme',
            workingDay: 'Radni dan',
                openTime: 'Vrijeme Otvaranja',
                    closeTime: 'Vrijeme Zatvaranja',
                        noWorkingHours: 'Radno vrijeme nije navedeno',
                            days: {
            0: 'Nedjelja',
                1: 'Ponedjeljak',
                    2: 'Utorak',
                        3: 'Srijeda',
                            4: 'Četvrtak',
                                5: 'Petak',
                                    6: 'Subota'
        }
    },

    messages: {
        updateSuccess: 'Informacije o filijali uspješno ažurirane',
            deleteSuccess: 'Filijala uspješno izbrisana',
                temporaryCloseSuccess: 'Filijala privremeno zatvorena',
                    reopenSuccess: 'Filijala ponovo otvorena',
                        updateError: 'Došlo je do greške prilikom ažuriranja',
                            deleteError: 'Došlo je do greške prilikom brisanja',
                                statusChangeError: 'Došlo je do greške prilikom promjene statusa',
                                    loadError: 'Došlo je do greške prilikom učitavanja informacija o filijali',
                                        nameUpdated: 'Ime filijale uspješno ažurirano',
                                            nameUpdateError: 'Neuspjelo ažuriranje imena filijale'
    },

    errors: {
        nameRequired: 'Ime filijale je obavezno',
            saveFailed: 'Neuspjelo čuvanje imena filijale',
                popupBlocked: 'Molimo dozvolite iskačuće prozore za otvaranje online menija',
                    failedToGetPublicId: 'Neuspjelo dobivanje linka online menija',
                        failedToCopyLink: 'Neuspjelo kopiranje linka'
    },

    placeholders: {
        branchName: 'Unesite ime filijale',
            whatsappNumber: 'Unesite WhatsApp broj',
                email: 'Unesite email adresu',
                    country: 'Unesite državu',
                        city: 'Unesite grad',
                            street: 'Unesite ulicu',
                                postalCode: 'Unesite poštanski broj',
                                    region: 'Unesite regiju'
    }
},

branchCategories: {
    // Header and Stats
    editCategoryName: 'Uredi Ime Kategorije',
        originalName: 'Originalno Ime',
            categoryName: 'Ime Kategorije',
                enterCategoryName: 'Unesite Ime Kategorije',
                    header: 'Upravljanje Kategorijama Filijale',
                        subheader: 'Upravljajte kategorijama i proizvodima za Filijalu ',
                            lastUpdated: 'Zadnje Ažurirano',

                                stock : {
        inStock: 'Na Stanju',
            outOfStock: 'Nema na Stanju'
    },
    stats: {
        availableCategories: 'Dostupne Kategorije',
            readyToAdd: 'Spremno za dodavanje',
                activeCategories: 'Aktivne Kategorije',
                    currentlyInBranch: 'Trenutno u filijali',
                        selectedCategories: 'Odabrane Kategorije',
                            toBeAdded: 'Za dodati',
                                selectedProducts: 'Odabrani Proizvodi',
                                    fromCategories: 'Iz kategorija',
                                        avalibleAddons: 'Dostupni Prilozi',
    },

    // Tab Navigation
    tabs: {
        addNew: 'Dodaj Novo',
            manageExisting: 'Upravljaj Postojećim'
    },

    // Step Progress
    steps: {
        chooseCategories: 'Odaberi Kategorije',
            selectProducts: 'Odaberi Proizvode',
                reviewAdd: 'Pregledaj i Dodaj',
                    finalStep: 'Završni korak',
                        selected: 'odabrano',
                            back: 'Nazad'
    },

    // Add New Categories
    addCategories: {
        title: 'Odaberi Kategorije',
            subtitle: 'Odaberite kategorije za dodavanje u vašu filijalu',
                noAvailable: 'Nema dostupnih kategorija',
                    allAdded: 'Sve dostupne kategorije su dodane u ovu filijalu',
                        categoriesSelected: 'odabranih kategorija',
                            clearSelection: 'Očisti Odabir',
                                nextSelectProducts: 'Sljedeće: Odaberi Proizvode'
    },

    // Select Products
    selectProducts: {
        title: 'Odaberi Proizvode',
            subtitle: 'Odaberite proizvode iz odabranih kategorija',
                selectAll: 'Odaberi Sve',
                    clearAll: 'Očisti Sve',
                        noProducts: 'Nema pronađenih proizvoda',
                            noProductsInCategories: 'Odabrane kategorije nemaju nikakve proizvode',
                                available: 'dostupno',
                                    selected: 'odabrano',
                                        productsSelectedFrom: 'odabranih proizvoda iz',
                                            categories: 'kategorija',
                                                reviewSelection: 'Pregledaj Odabir'
    },

    // Review and Add
    review: {
        title: 'Pregledaj i Dodaj',
            subtitle: 'Pregledajte svoj odabir prije dodavanja u filijalu',
                of: 'od',
                    productsSelected: 'odabranih proizvoda',
                        all: 'Sve',
                            productsWillBeAdded: 'proizvodi će biti dodani',
                                totalValue: 'Ukupna vrijednost',
                                    selectedProducts: 'Odabrani Proizvodi',
                                        readyToAdd: 'Spremno za dodavanje',
      with: 'sa',
            availableInBranch: 'Dostupno u Filijali',
                startOver: 'Počni Ispočetka',
                    adding: 'Dodavanje...',
                        addToBranch: 'Dodaj u Filijalu'
    },

    // Manage Existing
    manage: {
        title: 'Upravljaj Postojećim Kategorijama',
            subtitle: 'Upravljajte kategorijama i proizvodima u vašoj filijali',
                saving: 'Čuvanje...',
                    saveOrder: 'Sačuvaj Redoslijed',
                        exitReorder: 'Izađi iz Preuređivanja',
                            reorder: 'Preuredi',
                                noCategoriesAdded: 'Nema dodanih kategorija',
                                    noCategoriesAddedDesc: 'Nijedna kategorija još nije dodana u ovu filijalu',
                                        addCategories: 'Dodaj Kategorije',
                                            original: 'Original:',
                                                customized: 'Prilagođeno',
                                                    added: 'dodano',
                                                        available: 'dostupno',
                                                            total: 'Ukupno',
                                                                active: 'Aktivno',
                                                                    inactive: 'Neaktivno',
                                                                        protected: 'Zaštićeno'
    },

    // Products Section
    products: {
        inCategory: 'Proizvodi u Kategoriji',
            added: 'Dodano',
                available: 'Dostupno',
                    ingredients: 'sastojci',
                        allergens: 'alergeni',
                            viewDetails: 'Vidi Detalje',
                                removeFromBranch: 'Ukloni iz Filijale',
                                    addToBranch: 'Dodaj u Filijalu',
                                        addedToBranch: 'proizvodi dodani u filijalu',
                                            moreAvailableToAdd: 'još dostupno za dodavanje',
                                                withDetailedInfo: 'sa detaljnim informacijama',
                                                    products: 'proizvodi',
                                                        activate: 'Aktiviraj Proizvod',
                                                            deactivate: 'Deaktiviraj Proizvod',
                                                                markInStock: 'Označi kao Na Stanju',
                                                                    markOutOfStock: 'Označi kao Nema na Stanju',
                                                                        configureAddons: 'Konfiguriši Priloge',
                                                                            manageExtras: 'Upravljaj Dodacima'
    },

    // Product Details Modal
    productDetails: {
        addedToBranch: 'Dodano u Filijalu',
            allergens: 'Alergeni',
                contains: 'Sadrži',
                    mayContain: 'Može Sadržavati',
                        ingredients: 'Sastojci',
                            allergenic: 'Alergeno',
                                available: 'Dostupno',
                                    unavailable: 'Nedostupno',
                                        quantity: 'Količina:',
                                            ingredientId: 'ID Sastojka:',
                                                allergenInformation: 'Informacije o Alergenima:',
                                                    additionalInformation: 'Dodatne Informacije',
                                                        originalProduct: 'Originalni Proizvod',
                                                            originalPrice: 'Originalna Cijena:',
                                                                originalStatus: 'Originalni Status:',
                                                                    originalDisplayOrder: 'Originalni Redoslijed Prikaza:',
                                                                        orderDetails: 'Detalji Narudžbe',
                                                                            lastUpdated: 'Zadnje Ažurirano:',
                                                                                close: 'Zatvori'
    },

    // Common Actions
    actions: {
        refresh: 'Osvježi',
            delete: 'Izbriši',
                edit: 'Uredi',
                    save: 'Sačuvaj',
                        cancel: 'Otkaži',
                            confirm: 'Potvrdi',
                                loading: 'Učitavanje...'
    },

    // Search and Filters
    search: {
        categories: 'Pretraži kategorije...',
            products: 'Pretraži proizvode...'
    },

// Status,
status: {
    active: 'Aktivno',
        inactive: 'Onemogućeno ',
            available: 'Dostupno',
                unavailable: 'Nedostupno'
},

// Messages
messages: {
    success: {
        categoryAdded: 'Kategorija uspješno dodana',
            categoryDeleted: 'Kategorija uspješno izbrisana',
                productAdded: 'Proizvod {name} uspješno dodan',
                    productRemoved: 'Proizvod {name} uspješno uklonjen',
                        orderSaved: 'Redoslijed kategorija uspješno sačuvan',
                            nameUpdated: 'Ime kategorije uspješno ažurirano'
    },
    error: {
        cannotDelete: 'Nije moguće izbrisati kategoriju "{name}" jer sadrži {count} proizvoda. Molimo prvo uklonite sve proizvode.',
            cannotDeleteTooltip: 'Brisanje nije moguće: Kategorija sadrži {count} proizvoda. Prvo uklonite sve proizvode.',
                productNotFound: 'Proizvod nije pronađen',
                    addingProduct: 'Greška prilikom dodavanja proizvoda',
                        removingProduct: 'Greška prilikom uklanjanja proizvoda',
                            savingOrder: 'Greška prilikom čuvanja redoslijeda kategorija',
                                loadingCategories: 'Greška prilikom učitavanja kategorija',
                                    loadingProducts: 'Greška prilikom učitavanja proizvoda'
    }
},

// Delete Modal
deleteModal: {
    title: 'Izbriši Područje',
        message: 'Jeste li sigurni da želite izbrisati Područje "{name}"? Ova radnja se ne može poništiti.',
            confirm: 'Izbriši',
                cancel: 'Otkaži'
},

// Placeholders
placeholders: {
    searchCategories: 'Pretraži kategorije...',
        searchProducts: 'Pretraži proizvode...'
}
  },

profile: {
    title: 'Profil',
        personalInfo: 'Lične Informacije',
            editProfile: 'Uredi Profil',
                accountStatus: {
        active: 'Aktivan Račun',
            inactive: 'Neaktivan Račun',
                status: 'Status Računa'
    },
    fields: {
        firstName: 'Ime',
            lastName: 'Prezime',
                username: 'Korisničko Ime',
                    email: 'Email',
                        registrationDate: 'Datum Registracije',
                            restaurantName: 'Ime Restorana',
                                status: 'Status'
    },
    restaurant: {
        info: 'Informacije o Restoranu',
            name: 'Ime Restorana',
                status: {
            active: 'Aktivno',
                inactive: 'Neaktivno'
        }
    },
    permissions: {
        summary: 'Sažetak Dozvola',
            totalCategories: 'Ukupno Kategorija',
                totalPermissions: 'Ukupno Dozvola',
                    rolesAndPermissions: 'Kategorije i Dozvole',
                        systemRole: 'Sistemska Uloga'
    },
    categories: {
        'Category': 'Upravljanje Kategorijama',
            'BranchCategory': 'Upravljanje Kategorijama Filijale',
                'Product': 'Upravljanje Proizvodima',
                    'BranchProduct': 'Upravljanje Proizvodima Filijale',
                        'BranchQRCode': 'Upravljanje QR Kodovima',
                            'Order': 'Upravljanje Narudžbama',
                                'Restaurant': 'Upravljanje Restoranom',
                                    'Branch': 'Upravljanje Filijalom',
                                        'Admin': 'Administratorske Operacije'
    },
    permissionNames: {
        'category.create': 'Kreiraj Kategoriju',
            'category.delete': 'Izbriši Kategoriju',
                'category.update': 'Ažuriraj Kategoriju',
                    'category.read': 'Vidi Kategoriju',
                        'branch.category.create': 'Kreiraj Kategoriju Filijale',
                            'branch.category.delete': 'Izbriši Kategoriju Filijale',
                                'branch.category.update': 'Ažuriraj Kategoriju Filijale',
                                    'branch.category.read': 'Vidi Kategoriju Filijale',
                                        'product.create': 'Kreiraj Proizvod',
                                            'product.delete': 'Izbriši Proizvod',
                                                'product.update': 'Ažuriraj Proizvod',
                                                    'product.read': 'Vidi Proizvod',
                                                        'product.edit': 'Uredi Proizvod',
                                                            'branch.product.create': 'Kreiraj Proizvod Filijale',
                                                                'branch.product.delete': 'Izbriši Proizvod Filijale',
                                                                    'branch.product.update': 'Ažuriraj Proizvod Filijale',
                                                                        'branch.product.read': 'Vidi Proizvod Filijale',
                                                                            'branch.qrcode.create': 'Kreiraj QR Kod',
                                                                                'branch.qrcode.delete': 'Izbriši QR Kod',
                                                                                    'branch.qrcode.update': 'Ažuriraj QR Kod',
                                                                                        'branch.qrcode.read': 'Vidi QR Kod',
                                                                                            'order.create': 'Kreiraj Narudžbu',
                                                                                                'order.delete': 'Izbriši Narudžbu',
                                                                                                    'order.update': 'Ažuriraj Narudžbu',
                                                                                                        'order.read': 'Vidi Narudžbu',
                                                                                                            'order.view': 'Vidi Detalje Narudžbe',
                                                                                                                'order.cancel': 'Otkaži Narudžbu',
                                                                                                                    'restaurant.create': 'Kreiraj Restoran',
                                                                                                                        'restaurant.delete': 'Izbriši Restoran',
                                                                                                                            'restaurant.update': 'Ažuriraj Restoran',
                                                                                                                                'restaurant.read': 'Vidi Restoran',
                                                                                                                                    'restaurant.user.create': 'Kreiraj Korisnika Restorana',
                                                                                                                                        'restaurant.user.delete': 'Izbriši Korisnika Restorana',
                                                                                                                                            'restaurant.user.update': 'Ažuriraj Korisnika Restorana',
                                                                                                                                                'restaurant.user.read': 'Vidi Korisnika Restorana',
                                                                                                                                                    'branch.create': 'Kreiraj Filijalu',
                                                                                                                                                        'branch.delete': 'Izbriši Filijalu',
                                                                                                                                                            'branch.update': 'Ažuriraj Filijalu',
                                                                                                                                                                'branch.read': 'Vidi Filijalu',
                                                                                                                                                                    'branch.user.create': 'Kreiraj Korisnika Filijale',
                                                                                                                                                                        'branch.user.delete': 'Izbriši Korisnika Filijale',
                                                                                                                                                                            'branch.user.update': 'Ažuriraj Korisnika Filijale',
                                                                                                                                                                                'branch.user.read': 'Vidi Korisnika Filijale',
                                                                                                                                                                                    'admin.api.control': 'API Kontrola'
    },
    error: {
        loadFailed: 'Neuspjelo učitavanje podataka profila'
    },
    changePhoto: 'Promijeni'
},

addonModal: {
    title: 'Konfiguriši Priloge',
        loading: 'Učitavanje priloga...',
            refresh: 'Osvježi',
                search: {
        placeholder: 'Pretraži priloge po imenu, opisu ili kategoriji...'
    },
    stats: {
        available: 'Dostupno',
            assigned: 'Dodijeljeno',
                recommended: 'Preporučeno'
    },
    sections: {
        assignedAddons: 'Dodijeljeni Prilozi',
            availableAddons: 'Dostupni Prilozi'
    },
    emptyState: {
        title: 'Nema dostupnih priloga',
            description: 'Kontaktirajte upravu restorana da definišete kombinacije priloga za ovaj proizvod',
                productId: 'ID Proizvoda:'
    },
    actions: {
        add: 'Dodaj',
            remove: 'Ukloni',
                configure: 'Konfiguriši',
                    done: 'Gotovo',
                        saveChanges: 'Sačuvaj Promjene'
    },
    status: {
        assigned: 'DODIJELJENO',
            recommended: 'Preporučeno'
    },
    configuration: {
        title: 'Postavke Konfiguracije',
            specialPrice: 'Posebna Cijena',
                maxQuantity: 'Maks. Količina',
                    minQuantity: 'Min. Količina',

                        marketingText: 'Marketinški Tekst',
                            markRecommended: 'Označi kao preporučeno',
                                placeholders: {
            marketingText: 'npr., Popularan izbor, Najbolja vrijednost, Favorit kupaca...'
        }
    },
    messages: {
        success: {
            addonAdded: 'Prilog uspješno dodan',
                addonRemoved: 'Prilog uspješno uklonjen',
                    addonUpdated: 'Prilog uspješno ažuriran'
        },
        errors: {
            loadFailed: 'Neuspjelo učitavanje priloga proizvoda',
                updateFailed: 'Neuspjelo ažuriranje dodjele priloga',
                    propertiesFailed: 'Neuspjelo ažuriranje svojstava priloga'
        }
    },
    footer: {
        summary: 'od',
            addon: 'prilog',
                addons: 'priloga',
                    assigned: 'dodijeljeno'
    }
},

menu: {
    title: "Meni",
        noCategories: "Nema liste",
            customizations: "Prilagođavanja",
                extras: "Dodaci",
                    each: "Svaki",
                        availableExtras: "Dostupni Dodaci",
                            no: "Ne",
                                basePrice: "Osnovna Cijena",
                                    loading: "Učitavanje Menija",
                                        allergens: "Alergeni",
                                            quantity: "Količina",
                                                addons: "Prilozi",
                                                    products: "Proizvodi",
                                                        addToBasket: "Dodaj u Korpu",
                                                            addToOrder: "Dodaj u Narudžbu",
                                                                resetSession: "Resetuj Sesiju",
                                                                    closeSession: "Zatvori Sesiju",
                                                                        loadingSubtitle: "Pripremamo naše ukusne izbore za vas...",
                                                                            error: {
        title: "Meni Nedostupan",
            tryAgain: "Pokušaj Ponovo"
    },
    search: {
        placeholder: "Pretraži ukusna jela..."
    },
    categories: "Kategorije",
        ingredients: "Sastojci",
            open: "Otvoreno",
                closed: "Zatvoreno",
                    chefsChoice: "Izbor Šefa Kuhinje",
                        add: "Dodaj",
                            remove: "Ukloni",
                                items: "stavki",
                                    item: "stavka",
                                        available: "dostupno",
                                            deliciousItems: "ukusno",
                                                exploreMenu: "Istraži Naš Meni",
                                                    noResults: "Nema rezultata",
                                                        noResultsDesc: "Pokušajte s drugim ključnim riječima ili pregledajte druge kategorije",
                                                            noItemsCategory: "Nema stavki u ovoj kategoriji",
                                                                noItemsCategoryDesc: "Provjerite druge kategorije za ukusne opcije",
                                                                    selectCategory: "Odaberite kategoriju da počnete istraživati našu pažljivo pripremljenu kulinarsku ponudu",
                                                                        whyChooseUs: {
        title: "Zašto Odabrati Nas?",
            subtitle: "Doživite kulinarsku izvrsnost uz našu posvećenost kvaliteti, svježini i izuzetnoj usluzi",
                freshIngredients: {
            title: "Svježi Sastojci",
                description: "Lokalno nabavljeni, sastojci vrhunske kvalitete pripremljeni svaki dan"
        },
        fastDelivery: {
            title: "Brza Dostava",
                description: "Brza i pouzdana usluga dostave do vašeg praga"
        },
        qualityAssured: {
            title: "Garantovana Kvaliteta",
                description: "Stroga kontrola kvalitete i higijenski standardi"
        },
        expertChefs: {
            title: "Stručni Šefovi Kuhinje",
                description: "Iskusni kulinarski profesionalci koji stvaraju nezaboravna iskustva"
        }
    },
    footer: {
        brand: "MenuHub",
            description: "Otkrijte izuzetna gastronomska iskustva uz naš odabrani izbor restorana i ukusnih kuhinja.",
                quickLinks: "Brzi Linkovi",
                    getInTouch: "Kontaktirajte Nas",
                        visitUs: "Posjetite Nas",
                            callUs: "Nazovite Nas",
                                emailUs: "Pošaljite Nam Email",
                                    copyright: "Sva prava pridržana.",
                                        privacyPolicy: "Politika Privatnosti",
                                            termsOfService: "Uslovi Korištenja",
                                                poweredBy: "Pokreće",
                                                    links: {
            ourMenu: "Naš Meni",
                aboutUs: "O Nama",
                    locations: "Lokacije",
                        reservations: "Rezervacije",
                            specialOffers: "Posebne Ponude",
                                giftCards: "Poklon Kartice"
        },
        services: {
            onlineOrdering: "Online Naručivanje",
                tableBooking: "Rezervacija Stola",
                    privateEvents: "Privatni Događaji",
                        catering: "Catering",
                            takeaway: "Za Ponijeti",
                                corporateMeals: "Korporativni Obroci"
        }
    },
    cart: {
        "title": "Korpa",
            "newOrder": "Nova Narudžba",
                "orders": "Narudžbe",
                    "orderType": "Tip Narudžbe",
                        "table": "Stol:",
                            "notes": "Napomene:",
                                "price_change_title": "Promjena Cijene",
                                    "confirm": "Potvrdi",
                                        "cancel": "Otkaži",
                                            error : "Greška",
                                                removal_item_toggle: "Ukloni Stavku",
                                                    "cancel_Reason_prompt_title": "Razlog Otkazivanja",
                                                        "reason": "Razlog Otkazivanja",
                                                            "submit": "Pošalji",
                                                                "confirm_cancel_title": "Razlog koji ste napisali stići će u restoran.",
                                                                    "cancel_order_confirm": "Jeste li sigurni da želite otkazati narudžbu?",
                                                                        "order_cancelled_success": "Vaša narudžba je uspješno otkazana.",
                                                                            "success": "Uspjeh",
                                                                                "order_can_be_updated": "Narudžba se može ažurirati",
                                                                                    "time_remaining": "Preostalo vrijeme",
                                                                                        "modified_times": "Izmijenjeno {{count}} put(a)",
                                                                                            "edit_order": "Uredi narudžbu",
                                                                                                "edit_order_items": "Uredi Stavke Narudžbe",
                                                                                                    "update_reason": "Razlog Ažuriranja",
                                                                                                        "tableNumberRequired": "Broj stola je obavezan",
                                                                                                            "update_reason_placeholder": "Zašto ažurirate ovu narudžbu?",
                                                                                                                "update_reason_required": "Molimo navedite razlog za ažuriranje",
                                                                                                                    "no_changes_detected": "Nisu otkrivene promjene. Molimo izmijenite stavke prije ažuriranja.",
                                                                                                                        "characters": "znakova",
                                                                                                                            "updating": "Ažuriranje...",
                                                                                                                                "update_order": "Ažuriraj Narudžbu",
                                                                                                                                    "was": "bilo je",
                                                                                                                                        "add_note": "Dodaj napomenu...",
                                                                                                                                            "marked_for_deletion": "Označeno za brisanje",
                                                                                                                                                "restore_item": "Vrati stavku",
                                                                                                                                                    "delete_item": "Izbriši stavku",
                                                                                                                                                        "order_updated_success": "Narudžba uspješno ažurirana!",
                                                                                                                                                            "order_update_failed": "Neuspjelo ažuriranje narudžbe",
                                                                                                                                                                "price_change_confirm": "Neke cijene su se promijenile otkako ste naručili. Želite li nastaviti sa ažuriranjem?",
                                                                                                                                                                    "cancel_order": "Otkaži Narudžbu",
                                                                                                                                                                        "refresh": "Osvježi",
                                                                                                                                                                            "refreshing": "Osvježavanje...",
                                                                                                                                                                                "remove": "Ukloni",
                                                                                                                                                                                    "empty": "Vaša korpa je prazna",
                                                                                                                                                                                        "emptyDesc": "Započnite dodavanjem nekih stavki u vašu korpu",
                                                                                                                                                                                            "total": "Ukupno",
                                                                                                                                                                                                "placeOrder": "Naruči",
                                                                                                                                                                                                    "proceed": "Nastavi na Naručivanje",
                                                                                                                                                                                                        "processing": "Obrada...",
                                                                                                                                                                                                            "clear": "Očisti Korpu",
                                                                                                                                                                                                                "item": "stavka",
                                                                                                                                                                                                                    "items": "stavki",
                                                                                                                                                                                                                        "variant": "varijanta",
                                                                                                                                                                                                                            "variants": "varijante",
                                                                                                                                                                                                                                "plain": "Obično",
                                                                                                                                                                                                                                    "customized": "Prilagođeno",
                                                                                                                                                                                                                                        "addons": "Prilozi",
                                                                                                                                                                                                                                            "variantTotal": "Ukupno Varijante",
                                                                                                                                                                                                                                                "quantity": "Količina",
                                                                                                                                                                                                                                                    "each": "svaki",
                                                                                                                                                                                                                                                        "min": "Min",
                                                                                                                                                                                                                                                            "max": "Maks",
                                                                                                                                                                                                                                                                "qty": "Kol",
                                                                                                                                                                                                                                                                    "minQuantityError": "Minimalna količina za {name} je {min}",
                                                                                                                                                                                                                                                                        "maxQuantityError": "Maksimalna količina za {name} je {max}",
                                                                                                                                                                                                                                                                            "decreaseQuantity": "Smanji količinu",
                                                                                                                                                                                                                                                                                "increaseQuantity": "Povećaj količinu",
                                                                                                                                                                                                                                                                                    "creating_order": "Kreiranje narudžbe...",
                                                                                                                                                                                                                                                                                        "order_created_success": "Narudžba uspješno kreirana!",
                                                                                                                                                                                                                                                                                            "order_creation_failed": "Neuspjelo kreiranje narudžbe. Molimo pokušajte ponovo.",
                                                                                                                                                                                                                                                                                                "sending_whatsapp": "Slanje WhatsApp poruke...",
                                                                                                                                                                                                                                                                                                    "whatsapp_sent_success": "WhatsApp poruka uspješno poslana!",
                                                                                                                                                                                                                                                                                                        "whatsapp_send_failed": "Neuspjelo slanje WhatsApp poruke",
                                                                                                                                                                                                                                                                                                            "clearing_basket": "Čišćenje korpe...",
                                                                                                                                                                                                                                                                                                                "basket_cleared": "Korpa uspješno očišćena!",
                                                                                                                                                                                                                                                                                                                    "clear_basket_failed": "Neuspjelo čišćenje korpe",
                                                                                                                                                                                                                                                                                                                        "load_order_types_failed": "Neuspjelo učitavanje tipova narudžbe",
                                                                                                                                                                                                                                                                                                                            "confirming_price_changes": "Potvrđivanje promjena cijena...",
                                                                                                                                                                                                                                                                                                                                "price_changes_confirmed": "Promjene cijena uspješno potvrđene!",
                                                                                                                                                                                                                                                                                                                                    "price_changes_failed": "Neuspjelo potvrđivanje promjena cijena",
                                                                                                                                                                                                                                                                                                                                        "session_required": "ID sesije je obavezan",
                                                                                                                                                                                                                                                                                                                                            "extras": "Dodaci",
                                                                                                                                                                                                                                                                                                                                                "without": "Bez",
                                                                                                                                                                                                                                                                                                                                                    "extra": "Extra",
                                                                                                                                                                                                                                                                                                                                                        "add": "Dodaj",
                                                                                                                                                                                                                                                                                                                                                            "edit": "Uredi",
                                                                                                                                                                                                                                                                                                                                                                "cancel_edit": "Otkaži",
                                                                                                                                                                                                                                                                                                                                                                    "restore": "Vrati",
                                                                                                                                                                                                                                                                                                                                                                        "delete": "Izbriši",
                                                                                                                                                                                                                                                                                                                                                                            "duplicate": "Dupliciraj"
    },
},

order: {
    form: {
        title: 'Detalji Narudžbe',
            name: "ime",
                address: "adresa",
                    pleaseFillRequiredFields: "Molimo Ispunite Obavezna Polja",
                        phone: "telefon",
                            tableNumberPlaceholder : "Unesite broj stola ovdje..",
                                tableNumber: "Broj Stola",
                                    email: "email",
                                        orderDetails: 'Detalji Narudžbe',
                                            orderType: 'Tip Narudžbe',
                                                paymentMethod: 'Način Plaćanja',
                                                    cashDescription: 'Platite gotovinom prilikom dostave ili preuzimanja',
                                                        creditCardDescription: 'Platite sigurno kreditnom karticom online',
                                                            onlinePaymentDescription: 'Platite koristeći online načine plaćanja',
                                                                selectPaymentMethod: 'Odaberite način plaćanja...',
                                                                    orderTypeRequired: 'Tip narudžbe je obavezan',
                                                                        cash: 'Gotovina',
                                                                            information: 'Informacije',
                                                                                creditCard: 'Kreditna Kartica',
                                                                                    onlinePayment: 'Online Plaćanje',
                                                                                        selectOrderType: 'Odaberite tip narudžbe...',
                                                                                            orderInformation: 'Informacije o Narudžbi',
                                                                                                customerName: 'Ime Kupca',
                                                                                                    customerNameRequired: 'Ime kupca je obavezno',
                                                                                                        customerNamePlaceholder: 'Unesite ime kupca',
                                                                                                            deliveryAddress: 'Adresa za Dostavu',
                                                                                                                deliveryAddressRequired: 'Adresa za dostavu je obavezna za ovaj tip narudžbe',
                                                                                                                    deliveryAddressPlaceholder: 'Unesite adresu za dostavu',
                                                                                                                        phoneNumber: 'Broj Telefona',
                                                                                                                            phoneNumberRequired: 'Broj telefona je obavezan za ovaj tip narudžbe',
                                                                                                                                phoneNumberPlaceholder: 'Unesite broj telefona',
                                                                                                                                    specialInstructions: 'Posebne Upute',
                                                                                                                                        specialInstructionsPlaceholder: 'Bilo kakve posebne upute za vašu narudžbu...',
                                                                                                                                            orderSummary: 'Sažetak Narudžbe',
                                                                                                                                                notes: "Napomene o Narudžbi",
                                                                                                                                                    notesPlaceholder: "Ima li posebnih zahtjeva? (npr. Bez luka)",
                                                                                                                                                        subtotal: 'Međuzbir',
                                                                                                                                                            serviceCharge: 'Naknada za Uslugu',
                                                                                                                                                                minimumRequired: 'Minimalno potrebno',
                                                                                                                                                                    estimatedTime: 'Procijenjeno vrijeme',
                                                                                                                                                                        minutes: 'minuta',
                                                                                                                                                                            backToCart: 'Nazad u Korpu',
                                                                                                                                                                                createOrder: 'Kreiraj Narudžbu',
                                                                                                                                                                                    creating: 'Kreiranje...',
                                                                                                                                                                                        loadingOrderTypes: 'Učitavanje tipova narudžbe...',
                                                                                                                                                                                            noOrderTypes: 'Nema dostupnih tipova narudžbe. Molimo kontaktirajte podršku.',
                                                                                                                                                                                                minimumOrder: 'Minimalna narudžba',
                                                                                                                                                                                                    service: 'usluga',
                                                                                                                                                                                                        minimumOrderError: 'Minimalni iznos narudžbe za {type} je ${amount}. Trenutni ukupni iznos: ${current}'
    },
    validation: {
        fixErrors: 'Molimo ispravite sljedeće greške:',
            customerNameRequired: 'Ime kupca je obavezno',
                orderTypeRequired: 'Molimo odaberite tip narudžbe',
                    addressRequired: 'Adresa za dostavu je obavezna za ovaj tip narudžbe',
                        phoneRequired: 'Broj telefona je obavezan za ovaj tip narudžbe'
    }
},

orderTypes: {
    DINE_IN: {
        name: 'U Restoranu',
            description: 'Jedite za stolom u restoranu'
    },
    DELIVERY: {
        name: 'Dostava',
            description: 'Dostava na adresu'
    },
    PICKUP: {
        name: 'Preuzimanje',
            description: 'Naručite online, preuzmite u prodavnici'
    }
},

priceChange: {
    title: 'Otkrivene Promjene Cijena',
        description: 'Neke stavke u vašoj korpi imaju promjene cijena koje treba potvrditi prije nastavka narudžbe.',
            changesRequired: 'Potrebne Promjene:',
                defaultMessage: 'Ažuriranja cijena moraju biti potvrđena za nastavak.',
                    cancel: 'Otkaži',
                        confirm: 'Potvrdi i Nastavi',
                            confirming: 'Potvrđivanje...'
},

productModal: {
    "customizeOrder": "Prilagodite Svoju Narudžbu",
        "allergenInformation": "Informacije o Alergenima",
            "ingredients": "Sastojci",
                "availableAddons": "Dostupni Prilozi",
                    "add": "Dodaj",
                        "recommended": "Preporučeno",
                            "min": "Min",
                                "max": "Maks",
                                    "orderSummary": "Sažetak Narudžbe",
                                        "quantity": "Količina",
                                            "total": "Ukupno",
                                                "addToCart": "Dodaj u Korpu",
                                                    "addons": "Prilozi",
                                                        "extras": "Dodaci",
                                                            "required": "Obavezno",
                                                                "selected": "odabrano",
                                                                    "select": "Odaberi",
                                                                        "minSelect": "Min",
                                                                            "maxSelect": "Maks",
                                                                                "qty": "Kol",
                                                                                    "removal": "Uklanjanje",
                                                                                        "remove": "Ukloni",
                                                                                            "removed": "Uklonjeno",
"categoryRequired": "{{name}} je obavezno",
    "minSelectionError": "Odaberite najmanje {{min}} stavki iz {{name}}",
        "maxSelectionError": "Maksimalno {{max}} stavki dozvoljeno iz {{name}}",
            "extraRequired": "{{name}} je obavezno"
  },

errors: {
    loadingBasket: 'Neuspjelo učitavanje korpe',
        loadingOrderTypes: 'Neuspjelo učitavanje tipova narudžbe',
            removingItem: 'Neuspjelo uklanjanje stavke iz korpe',
                increasingQuantity: 'Neuspjelo povećanje količine stavke',
                    decreasingQuantity: 'Neuspjelo smanjenje količine stavke',
                        increasingAddonQuantity: 'Neuspjelo povećanje količine priloga',
                            clearingBasket: 'Neuspjelo čišćenje korpe',
                                creatingOrder: 'Neuspjelo kreiranje narudžbe',
                                    orderAlreadyProcessing: 'Ova narudžba se već obrađuje',
                                        priceChangeDetails: 'Neuspjelo učitavanje detalja o promjeni cijene',
                                            confirmingPriceChanges: 'Neuspjelo potvrđivanje promjena cijena',
                                                sessionIdRequired: 'ID sesije je obavezan za potvrdu promjene cijene',
                                                    addonProductNotFound: 'Nije moguće pronaći ID proizvoda priloga',
                                                        cartItemNotFound: 'Stavka korpe nije pronađena'
},
ordersManager: {
    total: 'Ukupno',
        PaymentMethod: "Način Plaćanja",
            clearFilters: "Očisti Filtere",
                subTotal: "Međuzbir",
                    filtered: "Filtrirano",
                        showing: "Prikazano",
                            updateAction: "Ažuriraj",
                                modificationHistory: "Historija Izmjena",
                                    lastModifiedAt : "Zadnja Izmjena",
                                        modifiedBy : "Izmijenio/la",
                                            modificationDetails: "Detalji Izmjene",
                                                loadingOrders: "Učitavanje Narudžbi...",
                                                    items: "stavke",
                                                        OrderType : 'Tip Narudžbe',
                                                            serviceFeeApplied: "Naknada za Uslugu",
                                                                DeliveryAddress : 'Adresa za Dostavu',
                                                                    OrderNotesInformation : 'Napomene i Informacije o Narudžbi',
                                                                        OrderMetadata: 'Metapodaci Narudžbe',
                                                                            ItemCount : 'Broj Stavki',
                                                                                TotalItems: 'Ukupno Stavki',
                                                                                    OrderTimeline: 'Vremenska Linija Narudžbe',
                                                                                        searchPlaceholder: "Pišite ovdje",
                                                                                            showAdvancedFilter: "Prikaži Napredne Filtere",
                                                                                                hideAdvancedFilter: "Sakrij Napredne Filtere",
                                                                                                    confirmedAt: "Potvrđeno",
                                                                                                        of: "od",
                                                                                                            orders: "narudžbi",
                                                                                                                clearFilter: "Očisti Filtere",
                                                                                                                    customerName: "Ime Kupca",
                                                                                                                        tableName: "Ime Stola",
                                                                                                                            orderType: "Tip Narudžbe",
                                                                                                                                minPrice : "Min Cijena",
                                                                                                                                    maxPrice: "Maks Cijena",
                                                                                                                                        Showing: "Prikazano",
                                                                                                                                            to: "do",
                                                                                                                                                perpage : "Po Stranici",
                                                                                                                                                    cancelOrder: "Otkaži Narudžbu",
                                                                                                                                                        cancelOrderConfirmation : "Jeste li sigurni da želite otkazati narudžbu?",
                                                                                                                                                            deletedOrders: "Izbrisane Narudžbe",
                                                                                                                                                                title: "Upravljanje Narudžbama",
                                                                                                                                                                    description: "Jednostavno upravljajte i pratite narudžbe vašeg restorana.",
                                                                                                                                                                        pendingOrders: "Narudžbe na Čekanju",
                                                                                                                                                                            branchOrders: "Narudžbe Filijale",
                                                                                                                                                                                allStatuses: "Svi Statusi",
                                                                                                                                                                                    statusFilter: "Filter Statusa",
                                                                                                                                                                                        noOrders: "Još nema narudžbi.",
                                                                                                                                                                                            customer: "Kupac",
                                                                                                                                                                                                orderNumber: "Broj Narudžbe",
                                                                                                                                                                                                    status: "Status",
                                                                                                                                                                                                        table: "Stol",
                                                                                                                                                                                                            amount: "Iznos",
                                                                                                                                                                                                                date: "Datum",
                                                                                                                                                                                                                    actions: "Radnje",
                                                                                                                                                                                                                        viewDetails: "Vidi Detalje",
                                                                                                                                                                                                                            confirm: "Potvrdi",
                                                                                                                                                                                                                                reject: "Odbij",
                                                                                                                                                                                                                                    changeStatus: "Promijeni Status",
                                                                                                                                                                                                                                        orderItems: "Stavke Narudžbe",
                                                                                                                                                                                                                                            createdAt: "Kreirano",
                                                                                                                                                                                                                                                confirmedA: "Potvrđeno",
                                                                                                                                                                                                                                                    rowVersion: "Verzija Reda",
                                                                                                                                                                                                                                                        confirmOrderTitle: "Potvrdi Narudžbu",
                                                                                                                                                                                                                                                            confirmOrderPrompt: "Jeste li sigurni da želite potvrditi ovu narudžbu?",
                                                                                                                                                                                                                                                                rejectOrderTitle: "Odbij Narudžbu",
                                                                                                                                                                                                                                                                    rejectOrderPrompt: "Unesite razlog odbijanja:",
                                                                                                                                                                                                                                                                        rejectReasonPlaceholder: "Razlog odbijanja...",
                                                                                                                                                                                                                                                                            updateStatusTitle: "Ažuriraj Status",
                                                                                                                                                                                                                                                                                updateStatusPrompt: "Jeste li sigurni da želite ažurirati status narudžbe?",
                                                                                                                                                                                                                                                                                    cancel: "Otkaži",
                                                                                                                                                                                                                                                                                        confirmAction: "Potvrdi",
                                                                                                                                                                                                                                                                                            rejectAction: "Odbij",
                                                                                                                                                                                                                                                                                                confirming: "Potvrđivanje...",
                                                                                                                                                                                                                                                                                                    rejecting: "Odbijanje...",
                                                                                                                                                                                                                                                                                                        updating: "Ažuriranje...",
                                                                                                                                                                                                                                                                                                            orderDetailsTitle: "Detalji Narudžbe",
                                                                                                                                                                                                                                                                                                                successNotification: "Operacija Uspješna",
                                                                                                                                                                                                                                                                                                                    orderConfirmedSucces: "Narudžba uspješno potvrđena!",
                                                                                                                                                                                                                                                                                                                        orderRejectedSuccess: "Narudžba uspješno odbijena!",
                                                                                                                                                                                                                                                                                                                            orderStatusUpdatedSuccess: "Status narudžbe uspješno ažuriran!",
                                                                                                                                                                                                                                                                                                                                errorInvalidStatusTransition: "Nevažeća promjena statusa: Molimo prvo potvrdite narudžbu (prebacite u status Potvrđeno).",
                                                                                                                                                                                                                                                                                                                                    errorCannotConfirm: "Ova narudžba se ne može potvrditi. Trenutni status: {currentStatus}.",
                                                                                                                                                                                                                                                                                                                                        quantity: "Količina",
                                                                                                                                                                                                                                                                                                                                            unitPrice: "Jedinična Cijena",
                                                                                                                                                                                                                                                                                                                                                addonPrice: "Cijena Priloga",
                                                                                                                                                                                                                                                                                                                                                    notes: "Napomene",
                                                                                                                                                                                                                                                                                                                                                        amountLabel: "Ukupan Iznos",
                                                                                                                                                                                                                                                                                                                                                            DeliveryInformation: "Informacije o Dostavi",
                                                                                                                                                                                                                                                                                                                                                                TableInformation: "Informacije o Stolu",
                                                                                                                                                                                                                                                                                                                                                                    CustomerInformation: "Informacije o Kupcu",
                                                                                                                                                                                                                                                                                                                                                                        CustomerName: "Ime Kupca",
                                                                                                                                                                                                                                                                                                                                                                            PhoneNumber: "Broj Telefona",
                                                                                                                                                                                                                                                                                                                                                                                OrderTag: "Oznaka Narudžbe",
                                                                                                                                                                                                                                                                                                                                                                                    OrderNotes: "Napomene o Narudžbi",
                                                                                                                                                                                                                                                                                                                                                                                        MinOrderAmount: "Minimalni Iznos Narudžbe",
                                                                                                                                                                                                                                                                                                                                                                                            CompletedAt: "Završeno",
                                                                                                                                                                                                                                                                                                                                                                                                time: "Vrijeme",
                                                                                                                                                                                                                                                                                                                                                                                                    Status: "Status",
  },

orderService: {
    "statuses": {
        "pending": "Na Čekanju",
            "confirmed": "Potvrđeno",
                "preparing": "Priprema se",
                    "ready": "Spremno",
                        "completed": "Završeno",
                            "delivered": "Dostavljeno",
                                "cancelled": "Otkazano",
                                    "rejected": "Odbijeno",
                                        "unknown": "Nepoznato"
    },
    "errors": {
        "createSessionOrder": "Greška pri kreiranju sesijske narudžbe",
            "getPendingOrders": "Greška pri dohvaćanju narudžbi na čekanju",
                "getTableOrders": "Greška pri dohvaćanju narudžbi stola",
                    "getOrder": "Greška pri dohvaćanju narudžbe",
                        "getBranchOrders": "Greška pri dohvaćanju narudžbi filijale",
                            "confirmOrder": "Greška pri potvrđivanju narudžbe",
                                "rejectOrder": "Greška pri odbijanju narudžbe",
                                    "updateOrderStatus": "Greška pri ažuriranju statusa narudžbe",
                                        "trackOrder": "Greška pri praćenju narudžbe",
                                            "getOrderTrackingQR": "Greška pri dohvaćanju QR koda za praćenje narudžbe",
                                                "smartCreateOrder": "Greška pri kreiranju pametne narudžbe",
                                                    "getTableBasketSummary": "Greška pri dohvaćanju sažetka korpe stola",
                                                        "validationError": "Greška validacije: {errors}",
                                                            "invalidRequest": "Nevažeći zahtjev. Molimo provjerite podatke.",
                                                                "sessionExpired": "Sesija je istekla. Molimo prijavite se ponovo.",
                                                                    "unauthorized": "Niste ovlašteni za ovu radnju.",
                                                                        "orderNotFound": "Narudžba nije pronađena.",
                                                                            "invalidStatus": "Status narudžbe nije pogodan za ovu radnju.",
                                                                                "noInternet": "Provjerite svoju internet vezu.",
                                                                                    "unknownError": "Nepoznata greška",
                                                                                        "getOrderTypeText": "Greška pri dohvaćanju teksta tipa narudžbe",
                                                                                            "getOrderType": "Greška pri dohvaćanju tipa narudžbe",
                                                                                                "getActiveOrderTypes": "Greška pri dohvaćanju aktivnih tipova narudžbe",
                                                                                                    "getAllOrderTypes": "Greška pri dohvaćanju svih tipova narudžbe",
                                                                                                        "orderTotalCalculation": "Greška pri izračunavanju ukupnog iznosa narudžbe",
                                                                                                            "getEstimatedTime": "Greška pri dohvaćanju procijenjenog vremena dostave",
                                                                                                                "getOrderTypeByCode": "Greška pri dohvaćanju tipa narudžbe po kodu",
                                                                                                                    "getOrderTypesForDisplay": "Greška pri dohvaćanju tipova narudžbe za prikaz",
                                                                                                                        "unknownOrderType": "Nepoznat tip narudžbe"
    }
},

branchPreferences: {
    title: "Postavke Filijale",
        description: "Konfigurišite postavke specifične za filijalu",
            loading: "Učitavanje postavki filijale...",
                saving: "Čuvanje...",
                    refresh: "Osvježi",
                        saveChanges: "Sačuvaj Promjene",
                            saveSuccess: "Postavke filijale uspješno sačuvane!",
                                cleanupModes: {
        afterTimeout: "Nakon Isteka Vremena",
            afterClosing: "Nakon Zatvaranja",
                disabled: "Onemogućeno"
    },
    sections: {
        orderManagement: {
            title: "Upravljanje Narudžbama",
                description: "Konfigurišite kako se rukuje i obrađuje narudžbe",
                    autoConfirmOrders: "Automatski Potvrdi Narudžbe",
                        autoConfirmOrdersDesc: "Automatski potvrdite dolazne narudžbe bez ručnog odobrenja",
                            useWhatsappForOrders: "WhatsApp za Narudžbe",
                                useWhatsappForOrdersDesc: "Omogućite WhatsApp integraciju za obavještenja o narudžbama"
        },
        displaySettings: {
            title: "Postavke Prikaza",
                description: "Konfigurišite koje informacije se prikazuju kupcima",
                    showProductDescriptions: "Prikaži Opise Proizvoda",
                        showProductDescriptionsDesc: "Prikaži detaljne opise proizvoda kupcima",
                            enableAllergenDisplay: "Prikaži Informacije o Alergenima",
                                enableAllergenDisplayDesc: "Prikaži upozorenja i informacije o alergenima",
                                    enableIngredientDisplay: "Prikaži Sastojke",
                                        enableIngredientDisplayDesc: "Prikaži liste sastojaka za proizvode"
        },
        paymentMethods: {
            title: "Načini Plaćanja",
                description: "Konfigurišite prihvaćene načine plaćanja",
                    acceptCash: "Prihvati Gotovinska Plaćanja",
                        acceptCashDesc: "Omogućite kupcima plaćanje gotovinom",
                            acceptCreditCard: "Prihvati Kreditne Kartice",
                                acceptCreditCardDesc: "Omogućite kupcima plaćanje kreditnim/debitnim karticama",
                                    acceptOnlinePayment: "Prihvati Online Plaćanja",
                                        acceptOnlinePaymentDesc: "Omogućite kupcima plaćanje online putem digitalnih načina plaćanja"
        },
        localization: {
            title: "Lokalizacija",
                description: "Konfigurišite jezičke i regionalne postavke",
                    defaultLanguage: "Zadani Jezik",
                        defaultCurrency: "Zadana Valuta",
                            timeZone: "Vremenska Zona",
                                supportedLanguages: "Podržani Jezici",
                                    languageRestaurantNote: "Filijale mogu odabrati samo jezike koje podržava restoran. Prikazani jezici su određeni od strane restorana."
        },
        sessionManagement: {
            title: "Upravljanje Sesijama",
                description: "Konfigurišite postavke isteka i čišćenja sesija",
                    sessionTimeout: "Istek Sesije (Minute)",
                        cleanupMode: "Način Čišćenja",
                            cleanupDela: "Odgoda Čišćenja Nakon Zatvaranja (Minute)",
                                cleanupModeDesc: "Odaberite kada čistiti istekle sesije",
                                    sessionTimeoutDesc: "Minute prije nego što sesija istekne zbog neaktivnosti",
                                        cleanupDelayDesc: "Minute čekanja nakon zatvaranja prije čišćenja",
                                            cleanupDisabledMessage: "Čišćenje sesija je onemogućeno. Sesije se neće automatski čistiti."
        }
    },
    currencies: {
        TRY: "Turska Lira ()",
            USD: "Američki Dolar ()",
                EUR: "Euro ()"
    },
    languages: {
        tr: "Turski",
            en: "Engleski",
                ar: "Arapski",
                    de: "Njemački",
                        fr: "Francuski",
                            es: "Španski",
                                it: "Talijanski",
                                    ru: "Ruski",
                                        zh: "Kineski",
                                            ja: "Japanski"
    },
    timezones: {
        "Europe/Istanbul": "Istanbul (UTC+3)",
            "Europe/London": "London (UTC+0)",
                "America/New_York": "New York (UTC-5)"
    },
    errors: {
        loadFailed: "Neuspjelo učitavanje postavki filijale",
            saveFailed: "Neuspjelo čuvanje postavki filijale",
                validationError: "Greška validacije: {errors}",
                    invalidRequest: "Nevažeći zahtjev. Molimo provjerite podatke.",
                        sessionExpired: "Sesija je istekla. Molimo prijavite se ponovo.",
                            unauthorized: "Nemate dozvolu za ovu radnju.",
                                notFound: "Postavke filijale nisu pronađene.",
                                    conflict: "Podaci nisu ažurirani. Molimo osvježite stranicu i pokušajte ponovo.",
                                        noInternet: "Provjerite svoju internet vezu.",
                                            unknownError: "Došlo je do nepoznate greške",
                                                invalidPaymentSettings: "Nevažeće postavke plaćanja. Najmanje jedan način plaćanja mora biti odabran.",
                                                    invalidSessionSettings: "Nevažeće postavke sesije. Molimo provjerite vrijednosti."
    }
},
whatsapp: {
    confirmation: {
        title: 'Poslati na WhatsApp?',
            subtitle: 'Obavijestite restoran putem WhatsApp-a',
                sendTo: 'Vaši detalji narudžbe bit će poslani na:',
                    restaurant: 'Restoran',
                        whatWillBeSent: 'Šta će biti poslano:',
                            orderDetails: '• Vaši detalji narudžbe i stavke',
                                customerInfo: '• Ime kupca i broj stola',
                                    totalPrice: '• Ukupna cijena i bilo kakve posebne napomene',
                                        timestamp: '• Vrijeme narudžbe',
                                            note: 'Napomena:',
                                                noteDescription: 'Ovo će otvoriti WhatsApp na vašem uređaju. Vaša narudžba će i dalje biti obrađena čak i ako odlučite ne poslati na WhatsApp.',
                                                    skipWhatsApp: 'Preskoči WhatsApp',
                                                        sendToWhatsApp: 'Pošalji na WhatsApp',
                                                            sending: 'Slanje...'
    }

},

recycleBin: {
    title: 'Kanta za Otpatke',
        titleProducts: 'Izbrisani Proizvodi i Kategorije',
            titleBranches: 'Izbrisane Filijale',
                titleTables: 'Izbrisani Stolovi',
                    titleBranchProducts: 'Izbrisani Proizvodi i Kategorije Filijale',
                        titleBranchCategories: 'Izbrisane Kategorije Filijale',
                            titleTableCategories: 'Izbrisane Kategorije Stolova',
                                description: 'Upravljajte izbrisanim filijalama, kategorijama, proizvodima i stolovima',
                                    descriptionProducts: 'Upravljajte izbrisanim proizvodima i kategorijama',
                                        descriptionBranches: 'Upravljajte izbrisanim filijalama',
                                            descriptionTables: 'Upravljajte izbrisanim stolovima',
                                                descriptionBranchProducts: 'Upravljajte izbrisanim proizvodima i kategorijama filijale',
                                                    descriptionBranchCategories: 'Upravljajte izbrisanim kategorijama filijale',
                                                        descriptionTableCategories: 'Upravljajte izbrisanim kategorijama stolova',
                                                            search: 'Pretraži stavke...',
                                                                filter: {
        all: 'Sve Stavke',
            group1: 'Sve Grupa 1',
                group2: 'Sve Grupa 2',
                    group1Label: '📋 Nivo Restorana (Filijale, Proizvodi, Stolovi)',
                        group2Label: '🏢 Nivo Filijale (Proizvodi i Kategorije Filijale)',
                            branches: 'Filijale',
                                categories: 'Kategorije',
                                    products: 'Proizvodi',
                                        tables: 'Stolovi',
                                            branchProducts: 'Proizvodi Filijale',
                                                branchCategories: 'Kategorije Filijale',
                                                    tableCategories: 'Kategorije Stolova'
    },
    refresh: 'Osvježi',
        loading: 'Učitavanje...',
            stats: {
        group1: 'Nivo Restorana',
            group1Desc: 'Filijale, Proizvodi, Stolovi',
                group2: 'Nivo Filijale',
                    group2Desc: 'Proizvodi i Kategorije Filijale',
                        totalDeleted: 'Ukupno Izbrisano',
                            extras: " Izbrisani Dodaci",
                                extrasDesc: "Svi izbrisani dodaci",
                                    totalDesc: 'Sve izbrisane stavke',
                                        filtered: 'Prikazano',
                                            filteredDesc: 'Rezultati trenutnog filtera',
                                                deletedBranch: 'Izbrisane Filijale',
                                                    deletedCategory: 'Izbrisane Kategorije',
                                                        deletedProduct: 'Izbrisani Proizvodi',
                                                            deletedTable: 'Izbrisani Stolovi',
                                                                deletedBranchProduct: 'Izbrisani Proizvodi Filijale',
                                                                    deletedBranchCategory: 'Izbrisane Kategorije Filijale',
                                                                        deletedTableCategory: 'Izbrisane Kategorije Stolova',

    },
    entityTypes: {
        category: 'Kategorija',
            product: 'Proizvod',
                branch: 'Filijala',

                    table: 'Stol',
                        branchProduct: 'Proizvod Filijale',
                            branchCategory: 'Kategorija Filijale',
                                tableCategory: 'Područje Stola',
                                    extraCategory: " Kategorija Dodataka",
                                        extra: 'Dodatak',
                                            other: 'Ostalo'
    },
    contextInfo: {
        category: 'Kategorija:',
            branch: 'Filijala:',
                restaurant: 'Restoran:'
    },
    deletedAt: 'Izbrisano:',
        restore: {
        button: 'Vrati',
            restoring: 'Vraćanje...',
                successCategory: 'Kategorija "{name}" je uspješno vraćena',
                    successCategoryCascade: 'Kategorija "{name}" i svi povezani proizvodi su uspješno vraćeni',
                        successProduct: 'Proizvod "{name}" je uspješno vraćen',
                            successProductCascade: 'Proizvod "{name}" i svi povezani podaci su uspješno vraćeni',
                                successBranch: 'Filijala "{name}" je uspješno vraćena',
                                    successBranchCascade: 'Filijala "{name}" i svi povezani podaci su uspješno vraćeni',
                                        successTable: 'Stol "{name}" je uspješno vraćen',
                                            successBranchProduct: 'Proizvod filijale "{name}" je uspješno vraćen',
                                                successBranchCategory: 'Kategorija filijale "{name}" je uspješno vraćena',
                                                    successTableCategory: 'Područje stola "{name}" je uspješno vraćeno',
                                                        successExtra: 'Dodatak "{name}" je uspješno vraćen',
                                                            successExtraCategory: 'Kategorija dodatka "{name}" je uspješno vraćena',
                                                                error: 'Operacija vraćanja nije uspjela'
    },
    productRestore: {
        title: 'Vrati Opcije Proizvoda',
            subtitle: 'Odaberite kako želite vratiti proizvod',
                simpleTitle: 'Vrati Proizvod',
                    simpleDesc: 'Vraćanje ovog proizvoda vratit će samo opće informacije o proizvodu.',
                        cascadeTitle: 'Vraćanje ovog proizvoda vratit će i sve povezane varijante i priloge.',
                            cascadeDesc: 'Želite li vratiti samo proizvod ili i sve povezane varijante i priloge?',
                                includeOptions: 'Uključi Varijante i Priloge',
                                    includeImages: 'Uključi Sliku Proizvoda',
                                        includeAll: 'Uključi Sve Povezane Podatke',
                                            recommended: 'Preporučeno',
      },
    categoryRestore: {
        title: "Vrati Kategoriju",
            subtitle: "Odaberite kako vratiti kategoriju",
                simpleTitle: "Jednostavno Vraćanje (Samo Opće Info)",
                    simpleDesc: "Vrati samo osnovne informacije o kategoriji (ime, opis)",
                        cascadeTitle: "Potpuno Vraćanje (Sa Svim Podacima)",
                            cascadeDesc: "Vrati kategoriju sa svim povezanim podacima:",
                                includeProducts: "Svi proizvodi u ovoj kategoriji",
                                    includeAll: "Sve povezane konfiguracije",
                                        recommended: "Preporučeno",
        },
    branchCategoryRestore: {
        title: "Vrati Kategoriju Filijale",
            subtitle: "Odaberite kako vratiti kategoriju filijale",
                simpleTitle: "Jednostavno Vraćanje (Samo Opće Info)",
                    simpleDesc: "Vrati samo osnovne informacije o kategoriji filijale",
                        cascadeTitle: "Potpuno Vraćanje (Sa Svim Podacima)",
                            cascadeDesc: "Vrati kategoriju filijale sa svim povezanim podacima:",
                                includeProducts: "Svi proizvodi filijale u ovoj kategoriji",
                                    includeAll: "Sve povezane konfiguracije",
                                        recommended: "Preporučeno",
        },
    tableCategoryRestore: {
        title: "Vrati Kategoriju Stola",
            subtitle: "Odaberite kako vratiti kategoriju stola",
                simpleTitle: "Jednostavno Vraćanje (Samo Opće Info)",
                    simpleDesc: "Vrati samo osnovne informacije o kategoriji stola",
                        cascadeTitle: "Potpuno Vraćanje (Sa Svim Podacima)",
                            cascadeDesc: "Vrati kategoriju stola sa svim povezanim podacima:",
                                includeTables: "Svi stolovi u ovoj kategoriji",
                                    includeAll: "Sve povezane konfiguracije",
                                        recommended: "Preporučeno",
        },
    extraCategoryRestore: {
        title: "Vrati Kategoriju Dodatka",
            subtitle: "Odaberite kako vratiti kategoriju dodatka",
                simpleTitle: "Jednostavno Vraćanje (Samo Opće Info)",
                    simpleDesc: "Vrati samo osnovne informacije o kategoriji dodatka",
                        cascadeTitle: "Potpuno Vraćanje (Sa Svim Podacima)",
                            cascadeDesc: "Vrati kategoriju dodatka sa svim povezanim podacima:",
                                includeExtras: "Svi dodaci u ovoj kategoriji",
                                    includeAll: "Sve povezane konfiguracije",
                                        recommended: "Preporučeno",
        },
    branchProductRestore: {
        title: "Vrati Proizvod Filijale",
            subtitle: "Odaberite kako vratiti proizvod filijale",
                simpleTitle: "Jednostavno Vraćanje (Samo Opće Info)",
                    simpleDesc: "Vrati samo osnovne informacije o proizvodu filijale",
                        cascadeTitle: "Potpuno Vraćanje (Sa Svim Podacima)",
                            cascadeDesc: "Vrati proizvod filijale sa svim povezanim podacima:",
                                includeOptions: "Opcije i postavke proizvoda filijale",
                                    includeAll: "Sve povezane konfiguracije",
                                        recommended: "Preporučeno",
        },
    extraRestore: {
        title: "Vrati Dodatak",
            subtitle: "Odaberite kako vratiti dodatak",
                simpleTitle: "Jednostavno Vraćanje (Samo Opće Info)",
                    simpleDesc: "Vrati samo osnovne informacije o dodatku",
                        cascadeTitle: "Potpuno Vraćanje (Sa Svim Podacima)",
                            cascadeDesc: "Vrati dodatak sa svim povezanim podacima:",
                                includeOptions: "Opcije i postavke dodatka",
                                    includeAll: "Sve povezane konfiguracije",
                                        recommended: "Preporučeno",
        },
    branchRestore: {
        title: 'Vrati Opcije Filijale',
            subtitle: 'Odaberite kako želite vratiti filijalu',
                simpleTitle: 'Vrati Filijalu',
                    simpleDesc: 'Vraćanje ove filijale vratit će samo opće informacije o filijali.',
                        cascadeTitle: 'Vraćanje ove filijale vratit će i sve povezane proizvode i kategorije.',
                            cascadeDesc: 'Želite li vratiti samo filijalu ili i sve povezane proizvode i kategorije?',
                                recommended: 'Preporučeno',
                                    includeProducts: 'Uključi Proizvode i Kategorije',
                                        includeTables: 'Uključi Stolove',
                                            includeAll: 'Uključi Sve Povezane Podatke',
    },
    empty: {
        title: 'Kanta za otpatke je prazna',
            titleFiltered: 'Nema rezultata',
                description: 'Još nema pronađenih izbrisanih stavki',
                    descriptionFiltered: 'Nema izbrisanih stavki koje odgovaraju vašim kriterijima pretrage'
    },
    errors: {
        loadingError: 'Greška pri učitavanju izbrisanih stavki'
    }
},

management: {
    "title": "Informacije o Upravljanju",
        "subtitle": "Informacije o kompaniji i pravni detalji",
            "noDataTitle": "Nema Informacija o Upravljanju",
                "noDataMessage": "Informacije o upravljanju još nisu postavljene. Molimo dodajte detalje restorana da biste započeli.",
                    dangerZone: {
        title: "Opasna Zona",
            description: "Oprez: Ove radnje su nepovratne. Molimo postupajte s oprezom.",
      },
    messages: {
        purgeSuccess: "Trajno Brisanje Uspješno"
    },
    "buttons": {
        "edit": "Uredi",
            "cancel": "Otkaži",
                "save": "Sačuvaj Promjene",
                    "saving": "Čuvanje Promjena...",
                        delete: "Izbriši Restoran",
                            purge: "Trajno Obriši Podatke Restorana",
                                viewFile: "Vidi Fajl",
                                    viewLogo: "Vidi Logo"
    },

    "sections": {
"restaurantDetails": "Detalji Restorana",
    "companyInfo": "Informacije o Kompaniji",
        "taxInfo": "Porez i Registracija",
            "certificates": "Sertifikati i Dozvole",
                "additionalSettings": "Dodatne Postavke"
      },

"fields": {
    "restaurantName": "Ime Restorana",
        "restaurantLogo": "Logo Restorana",
            "companyTitle": "Naziv Kompanije",
                "legalType": "Pravni Tip",
                    "taxNumber": "Poreski Broj",
                        "taxOffice": "Poreska Uprava",
                            "mersisNumber": "MERSIS Broj",
                                "tradeRegistry": "Broj Trgovačkog Registra",
                                    "workPermit": "Radna Dozvola",
                                        "foodCertificate": "Sertifikat o Hrani",
                                            "logo": "Logo"
},

"placeholders": {
    "restaurantName": "Unesite ime restorana",
        "companyTitle": "Unesite naziv kompanije",
            "taxNumber": "Unesite poreski broj",
                "taxOffice": "Unesite poresku upravu",
                    "mersisNumber": "Unesite MERSIS broj",
                        "tradeRegistry": "Unesite broj trgovačkog registra",
                            "selectLegalType": "Odaberite Pravni Tip"
},

"legalTypes": {
    "llc": "D.O.O.",
        "corporation": "Korporacija",
            "partnership": "Partnerstvo"
},

"status": {
    "uploaded": "Učitano",
        "notUploaded": "Nije učitano",
            "available": "Dostupno",
                "notAvailable": "Nije Dostupno",
      },

"common": {
    "na": "N/P"
}
  },
"resetPassword": {
    "submitted": {
        "title": "Provjerite Svoj Email",
            "line1": "Poslali smo link za resetovanje lozinke na",
                "line2": "Molimo provjerite svoj inbox (i spam folder!)."
    },
    "form": {
        "title": "Resetuj Lozinku",
            "subtitle": "Unesite svoj email da biste dobili link za resetovanje.",
                "button": "Pošalji Link za Resetovanje",
                    "emailAddress": "Email Adresa",
                        "emailPlaceholder": "vi@primjer.com"
    }
},
"setNewPassword": {
    "form": {
        "title": "Postavi Novu Lozinku",
            "subtitle": "Unesite novu lozinku ispod.",
                "newPassword": "Nova Lozinka",
                    "confirmPassword": "Potvrdi Novu Lozinku",
                        "button": "Sačuvaj Novu Lozinku",
                            "errorMatch": "Lozinke se ne podudaraju.",
                                "errorLength": "Lozinka mora imati najmanje 8 znakova."
    },
    "submitted": {
        "title": "Lozinka Ažurirana!",
            "message": "Vaša lozinka je uspješno ažurirana. Sada se možete prijaviti."
    }
},
"confirmMail": {
    "submitted": {
        "title": "Provjerite Svoj Email",
            "line1": "Poslali smo novi link za potvrdu na",
                "line2": "Molimo provjerite svoj inbox (i spam folder!)."
    },
    "form": {
        "title": "Potvrdite Svoj Email",
            "subtitle": "Unesite svoj email da biste ponovo poslali link za potvrdu.",
                "button": "Ponovo Pošalji Potvrdu"
    }
},
branches: {
    "status": {
        "active": "Aktivno",
            "inactive": "Neaktivno"
    },
    "fields": {
        "branchType": "Tip Filijale",
            "branchTag": "Oznaka Filijale"
    }
},

restaurantsTab: {
    "status": {
        "active": "Aktivno",
            "inactive": "Neaktivno"
    },
    "actions": {
        "edit": "Uredi Restoran",
            "delete": "Izbriši Restoran"
    },
    "stats": {
        "totalBranches": "Ukupno Filijala",
            "active": "Aktivno",
                "inactive": "Neaktivno",
    },
    "common": {
        "yes": "Da",
            "no": "Ne"
    },
    "modal": {
        "editTitle": "Uredi Restoran",
            "placeholders": {
            "restaurantName": "Ime Restorana",
                "cuisineType": "Tip Kuhinje"
        },

        "buttons": {
            "update": "Ažuriraj Restoran",
                "updating": "Ažuriranje..."
        }
    }
},

tabs: {
    "restaurants": "Restorani",
        "branches": "Filijale",
            "management": "Info o Upravljanju",
                "deleted": "Izbrisano"
},

allergens: {
    "GLUTEN": {
        "name": "Gluten",
            "description": "Pšenica, raž, ječam, zob"
    },
    "CRUSTACEANS": {
        "name": "Ljuskari",
            "description": "Kozice, rakovi, jastog"
    },
    "EGGS": {
        "name": "Jaja",
            "description": "Jaja i proizvodi od jaja"
    },
    "FISH": {
        "name": "Riba",
            "description": "Svi riblji proizvodi"
    },
    "PEANUTS": {
        "name": "Kikiriki",
            "description": "Kikiriki i proizvodi od kikirikija"
    },
    "SOYBEANS": {
        "name": "Soja",
            "description": "Soja i proizvodi od soje"
    },
    "MILK": {
        "name": "Mlijeko",
            "description": "Mlijeko i mliječni proizvodi"
    },
    "NUTS": {
        "name": "Orašasti Plodovi",
            "description": "Bademi, lješnjaci, orasi, indijski oraščići, itd."
    },
    "CELERY": {
        "name": "Celer",
            "description": "Celer i korijen celera"
    },
    "MUSTARD": {
        "name": "Senf",
            "description": "Senf i proizvodi od senfa"
    },
    "SESAME": {
        "name": "Susam",
            "description": "Sjemenke susama i proizvodi"
    },
    "SULPHITES": {
        "name": "Sulfiti",
            "description": "Sumpor dioksid i sulfiti (>10mg/kg)"
    },
    "LUPIN": {
        "name": "Lupina",
            "description": "Lupina i proizvodi od lupine"
    },
    "MOLLUSCS": {
        "name": "Mekušci",
            "description": "Školjke, dagnje, kamenice, puževi, lignje"
    }
},
"tableQR": {
    "loading": {
        "validatingQR": "Validacija QR Koda",
            "fetchingTableInfo": "Dohvaćanje informacija o stolu..."
    },
    "error": {
        "title": "Greška",
            "tryAgain": "Pokušaj Ponovo",
                "sessionFeatureComingSoon": "Funkcija pokretanja sesije uskoro stiže.",
                    "sessionStartFailed": "Sesija nije mogla biti pokrenuta."
    },
    "header": {
        "title": "Meni Restorana",
            "subtitle": "Iskustvo Digitalnog Menija",
                "active": "Aktivno"
    },
    "welcome": {
        "greeting": "Dobrodošli!",
            "connectedToTable": "Uspješno povezano sa stolom",
                "tableStatus": "Status Stola",
                    "occupied": "Zauzeto",
                        "available": "Dostupno",
                            "capacity": "Kapacitet",
                                "person": "Osoba",
                                    "people": "Ljudi",
                                        "session": "Sesija",
                                            "sessionActive": "Aktivno",
                                                "sessionPending": "Na Čekanju",
                                                    "welcomeMessage": "Poruka Dobrodošlice"
    },
    "actions": {
        "viewMenu": "Vidi Meni",
            "callWaiter": "Pozovi Konobara"
    },
    "footer": {
        "connectedViaQR": "Povezano putem QR Koda • Sigurna sesija"
    }
},
"productCard": {
    "chefsPick": "Izbor Šefa",
        "customizable": "Prilagodljivo",
            "addons": "+prilozi",
                "outOfStock": "Nema na Stanju",
                    "allergens": "Alergeni",
                        "ingredients": "Sastojci",
                            "inCart": "u korpi",
                                "customizeOrder": "Prilagodi Narudžbu",
                                    "addToCart": "Dodaj u Korpu",
                                        "prepTime": "15-20 min",
                                            "popular": "Popularno",
                                                "rating": "4.8",
                                                    "more": "više"
},
"moneyCase": {
    "title": "Upravljanje Kasom",
        "subtitle": "Upravljajte gotovinskim operacijama vaše filijale",
            "selectBranch": "Odaberite filijalu",
                "selectBranchToView": "Odaberi Filijalu",
                    "branchSelector": "Odabir Filijale",
                        "noBranches": "Nema dostupnih filijala",
                            totalRevenue: "Ukupan Prihod",
                                periodSummary: "Sažetak Perioda",
                                    totalOrders: "Ukupno Narudžbi",
                                        totalTransactions: "Ukupno Transakcija",
                                            shiftDuration: "Trajanje Smjene",
                                                closedBy: "Zatvorio/la",
                                                    openedBy: "Otvorio/la",
                                                        showSummary: "Prikaži Sažetak",
                                                            hideSummary: "Sakrij Sažetak",
                                                                netCash: "Neto Gotovina",
                                                                    netCashDesc: "Ukupan priliv i odliv gotovine tokom sesije",
                                                                        serviceFeeDesc: "Ukupno prikupljene naknade za usluge tokom sesije",
                                                                            avgOrderValueDesc : "Prosječna vrijednost narudžbi obrađenih tokom sesije",
                                                                                totalShiftsDesc: "Ukupan broj provedenih sesija kase",
                                                                                    cashDiscrepancyDesc: "Ukupne razlike pronađene tokom usklađivanja gotovine",
                                                                                        cashDiscrepancy: "Razlika u Gotovini",
                                                                                            totalOrdersDesc: "Ukupan broj narudžbi obrađenih tokom sesije",
                                                                                                showingResults  : "Prikazujem rezultate za",
                                                                                                    from: "od",
                                                                                                        to: "do",
                                                                                                            grossSalesDesc: "Ukupna prodaja prije bilo kakvih odbitaka",
                                                                                                                operationalMetrics: "Operativni Metrički Podaci",
                                                                                                                    loadingSummary: "Učitavanje sažetka...",
                                                                                                                        pleaseWait: "Molimo sačekajte...",
                                                                                                                            financialOverview: "Finansijski Pregled",
                                                                                                                                suggestedBalance: "Predloženi Početni Saldo",
                                                                                                                                    previousCloseInfo: "Informacije o Prethodnom Zatvaranju",
                                                                                                                                        lastClosed: "Zadnje Zatvoreno",
                                                                                                                                            filters: {
        title: "Filteri",
            quickSelect: "Brzi Odabir",
                today: "Danas",
                    yesterday: "Jučer",
                        last7Days: "Zadnjih 7 Dana",
                            last30Days: "Zadnjih 30 Dana",
                                thisMonth: "Ovaj Mjesec",
                                    lastMonth: "Prošli Mjesec",
                                        custom: "Prilagođeno",
                                            fromDate: "Od Datuma",
                                                toDate: "Do Datuma",
                                                    apply: "Primijeni",
                                                        clear: "Očisti",
                                                            clearAll: "Očisti Sve",
                                                                to: "Do",
                                                                    from: "Od",
                                                                        active: "Aktivno"

    } ,
    "status": "Status",
        "open": "Otvoreno",
            "closed": "Zatvoreno",
                "todaySales": "Današnja Prodaja",
                    "todayCash": "Današnja Gotovina",
                        "todayCard": "Današnja Kartica",
                            "currentBalance": "Trenutni Saldo",
                                "transactionCount": "Broj Transakcija",
                                    "transactions": "Transakcije",

                                        "openCase": "Otvori Kasu",
                                            "closeCase": "Zatvori Kasu",
                                                "viewZReport": "Vidi Z Izvještaj",
                                                    "history": "Historija Kase",
                                                        "records": "Zapisi",
                                                            "noHistory": "Nema dostupne historije",
                                                                "noHistoryDescription": "Operacije kase pojavit će se ovdje",

                                                                    "openingBalance": "Početni Saldo",
                                                                        "openingBalanceDescription": "Unesite početni iznos gotovine u kasi",
                                                                            "closingBalance": "Završni Saldo",
                                                                                "actualCash": "Stvarna Gotovina",
                                                                                    "expectedCash": "Očekivana Gotovina",
                                                                                        "difference": "Razlika",
                                                                                            "surplus": "Višak",
                                                                                                "shortage": "Manjak",
                                                                                                    "notes": "Napomene",
                                                                                                        "notesPlaceholder": "Dodajte bilo kakve napomene ili komentare o ovoj sesiji kase...",

                                                                                                            "date": "Datum i Vrijeme",
                                                                                                                "openedAt": "Otvoreno U",
                                                                                                                    "closedAt": "Zatvoreno U",
                                                                                                                        "lastUpdated": "Zadnje Ažurirano",
                                                                                                                            "caseId": "ID Kase",

                                                                                                                                "confirm": "Potvrdi",
                                                                                                                                    "confirmClose": "Potvrdi Zatvaranje",
                                                                                                                                        "cancel": "Otkaži",
                                                                                                                                            "close": "Zatvori",
                                                                                                                                                "print": "Printaj",
                                                                                                                                                    "download": "Preuzmi",
                                                                                                                                                        serviceFee: "Naknada za Uslugu",
                                                                                                                                                            "avgOrderValue": "Prosj. Vrijednost Narudžbe",
                                                                                                                                                                "totalDiscrepancy": "Ukupna Razlika",
                                                                                                                                                                    "totalShifts": "Ukupno Smjena",
                                                                                                                                                                        "avgShiftDuration": "Prosj. Trajanje Smjene",
                                                                                                                                                                            "shiftsWithIssues": "Smjene sa Problemima",
                                                                                                                                                                                "period": "Period",
                                                                                                                                                                                    "todayTotalSales": "Današnja Ukupna Prodaja",
                                                                                                                                                                                        "currentShiftRevenue": "Prihod Trenutne Smjene",
                                                                                                                                                                                            "closedShifts": "Zatvorene Smjene",
                                                                                                                                                                                                "ordersToday": "Narudžbe Danas",
                                                                                                                                                                                                    "weekToDate": "Sedmica do Danas",
                                                                                                                                                                                                        "monthToDate": "Mjesec do Danas",
                                                                                                                                                                                                            "shifts": "Smjene",
                                                                                                                                                                                                                "orders": "Narudžbe",
                                                                                                                                                                                                                    "zReport": "Z Izvještaj",
                                                                                                                                                                                                                        "reportDate": "Datum Izvještaja",
                                                                                                                                                                                                                            "openingInformation": "Informacije o Otvaranju",
                                                                                                                                                                                                                                "salesSummary": "Sažetak Prodaje",
                                                                                                                                                                                                                                    "closingInformation": "Informacije o Zatvaranju",
                                                                                                                                                                                                                                        "totalSales": "Ukupna Prodaja",
                                                                                                                                                                                                                                            "cashSales": "Gotovinska Prodaja",
                                                                                                                                                                                                                                                "cardSales": "Kartična Prodaja",
                                                                                                                                                                                                                                                    "refunds": "Povrati",
                                                                                                                                                                                                                                                        "expenses": "Troškovi",
                                                                                                                                                                                                                                                            "noReportData": "Nema dostupnih podataka izvještaja",

                                                                                                                                                                                                                                                                "success": {
        "opened": "Kasa uspješno otvorena!",
            "closed": "Kasa uspješno zatvorena!",
                "closedWithDifference": "Kasa uspješno zatvorena! Razlika: {{difference}}"
    },

    "error": {
        "fetchBranches": "Neuspjelo dohvaćanje filijala",
            "fetchActiveCase": "Neuspjelo dohvaćanje aktivne kase",
                "fetchHistory": "Neuspjelo dohvaćanje historije kase",
                    "fetchZReport": "Neuspjelo dohvaćanje Z izvještaja",
                        "openCase": "Neuspjelo otvaranje kase",
                            "closeCase": "Neuspjelo zatvaranje kase",
                                "noBranchSelected": "Molimo prvo odaberite filijalu"
    },

    "validation": {
        "openingBalanceRequired": "Početni saldo je obavezan",
            "openingBalanceMin": "Početni saldo mora biti 0 ili veći",
                "actualCashRequired": "Stvarni iznos gotovine je obavezan",
                    "actualCashMin": "Stvarna gotovina mora biti 0 ili veća",
                        "notesMaxLength": "Napomene ne mogu prelaziti 500 znakova"
    },

    "modal": {
        "openTitle": "Otvori Kasu",
            "openDescription": "Započnite novu sesiju kase",
                "closeTitle": "Zatvori Kasu",
                    "closeDescription": "Završite trenutnu sesiju kase i uskladite gotovinu",
                        "zReportTitle": "Z Izvještaj - Detaljan Sažetak",
                            "confirmOpenMessage": "Jeste li sigurni da želite otvoriti novu kasu?",
                                "confirmCloseMessage": "Jeste li sigurni da želite zatvoriti trenutnu kasu? Ova radnja se ne može poništiti."
    }
},
user: {
    read: 'čitanje',
    },

"onboardingRestaurant": {
    "backLink": "Nazad na Stranicu Registracije",
        "progress": {
        "step1": "Osnovne Info",
            "step2": "Info o Kompaniji",
                "searchLanguages": "Pretraži Jezike",
                    "languagesLabel": "Jezici",
                        "step3": "Pravni Dokumenti"
    },
    "messages": {
        "welcome": "Informacije o vašem restoranu su uspješno sačuvane. Sada možete unijeti informacije o vašoj filijali.",
            "success": "Informacije o vašem restoranu su uspješno sačuvane! Preusmjeravanje na unos informacija o filijali...",
                "errors": {
            "sessionNotFound": "Informacije o sesiji nisu pronađene. Molimo prijavite se ponovo.",
                "serverConnection": "Nije moguće povezati se sa serverom. Molimo provjerite vašu internet vezu.",
                    "nameInUse": "Ovo ime restorana se već koristi. Molimo pokušajte drugo ime.",
                        "genericCreate": "Došlo je do greške prilikom registracije restorana. Molimo pokušajte ponovo.",
                            "idNotFound": "ID restorana nije mogao biti dohvaćen. Molimo pokušajte ponovo.",
                                "fileUploadGeneric": "Došlo je do greške prilikom učitavanja fajla",
                                    "filePathError": "Učitavanje fajla nije uspjelo: Putanja fajla nije primljena"
        }
    },
    "step1": {
        "title": "Informacije o Restoranu",
            "subtitle": "Unesite osnovne informacije o vašem restoranu",
                "nameLabel": "Ime Restorana *",
                    "namePlaceholder": "Unesite ime vašeg restorana",
                        "logoLabel": "Logo Restorana ",
                            "logoUploading": "Učitavanje loga...",
                                "logoSuccess": "✓ Logo uspješno učitan",
                                    "logoSuccessSub": "Cloudinary URL primljen",
                                        "cuisineLabel": "Tip Kuhinje ",
                                            "errors": {
            "nameRequired": "Ime restorana je obavezno",
                "logoRequired": "Logo restorana je obavezan",
                    "cuisineRequired": "Odaberite tip kuhinje"
        }
    },
    "step2": {
        "title": "Informacije o Kompaniji",
            "subtitle": "Unesite informacije o vašoj kompaniji",
                "companyTitleLabel": "Naziv Kompanije *",
                    "companyTitlePlaceholder": "Unesite naziv vaše kompanije",
                        "legalTypeLabel": "Pravni Tip *",
                            "legalTypePlaceholder": "Odaberite pravni tip",
                                "mersisLabel": "MERSIS Broj",
                                    "mersisPlaceholder": "Unesite vaš MERSIS broj",
                                        "tradeRegistryLabel": "Broj Trgovačkog Registra",
                                            "tradeRegistryPlaceholder": "Unesite vaš broj trgovačkog registra",
                                                "errors": {
            taxNumberRequired: "Poreski broj je obavezan",
                mersisRequired: "MERSIS broj je obavezan",
                    "companyTitleRequired": "Naziv kompanije je obavezan",
                        "legalTypeRequired": "Odaberite pravni tip"
        }
    },
    "step3": {
        "title": "Pravni Dokumenti",
            "subtitle": "Unesite vaše poreske informacije i dokumente",
                "taxNumberLabel": "Poreski Broj",
                    "taxNumberPlaceholder": "Unesite vaš poreski broj",
                        "taxOfficeLabel": "Poreska Uprava",
                            "taxOfficePlaceholder": "Unesite vašu poresku upravu",
                                "workPermitLabel": "Dokument Radne Dozvole",
                                    "workPermitUploading": "Učitavanje dokumenta radne dozvole...",
                                        "workPermitSuccess": "✓ Dokument radne dozvole uspješno učitan",
                                            "foodCertificateLabel": "Sertifikat o Hrani",
                                                "foodCertificateUploading": "Učitavanje sertifikata o hrani...",
                                                    "foodCertificateSuccess": "✓ Sertifikat o hrani uspješno učitan",
                                                        "errors": {
            taxNumberInvalid: "Unesite ispravan broj",
                "taxNumberRequired": "Poreski broj je obavezan",
                    "taxOfficeRequired": "Poreska uprava je obavezna"
        }
    },
    "navigation": {
        "previous": "Prethodni Korak",
            "next": "Sljedeći Korak",
                "submit": "Sačuvaj Restoran",
                    "submitting": "Čuvanje...",
                        "uploading": "Učitavanje Fajlova..."
    },
    "cuisineTypes": {
        "0": "Turska Kuhinja",
            "1": "Italijanska Kuhinja",
                "2": "Kineska Kuhinja",
                    "3": "Japanska Kuhinja",
                        "4": "Meksička Kuhinja",
                            "5": "Indijska Kuhinja",
"6": "Francuska Kuhinja",
    "7": "Američka Kuhinja",
        "8": "Mediteranska Kuhinja",
            "9": "Tajlandska Kuhinja",
                "10": "Korejska Kuhinja",
                    "11": "Vijetnamska Kuhinja",
                        "12": "Grčka Kuhinja",
                            "13": "Španska Kuhinja",
                                "14": "Libanska Kuhinja",
                                    "15": "Brazilska Kuhinja",
                                        "16": "Njemačka Kuhinja",
                                            "17": "Ruska Kuhinja",
                                                "18": "Britanska Kuhinja",
                                                    "19": "Etiopska Kuhinja",
                                                        "20": "Marokanska Kuhinja",
                                                            "21": "Argentinska Kuhinja",
                                                                "22": "Peruanska Kuhinja",
                                                                    "23": "Karipska Kuhinja",
                                                                        "24": "Fusion Kuhinja",
                                                                            "25": "Veganska Kuhinja",
                                                                                "26": "Morski Plodovi",
                                                                                    "27": "Steakhouse",
                                                                                        "28": "Brza Hrana"
    },
"legalTypes": {
    "as": "Dioničko Društvo (D.D.)",
        "ltd": "Društvo sa Ograničenom Odgovornošću (D.O.O.)",
            "collective": "Kolektivna Kompanija",
                "partnership": "Komanditno Društvo",
                    "sole": "Samostalni Poduzetnik",
                        "other": "Ostalo"
}
  },
"onboardingBranch": {
    "header": {
        "backLink": "Nazad na Informacije o Restoranu",
            "title": "Informacije o Filijali",
                "subtitle": "Unesite informacije o vašoj filijali restorana korak po korak"
    },
    "steps": {
        "basic": "Osnovne Informacije",
            "address": "Informacije o Adresi",
                "contact": "Kontakt Informacije"
    },
    "form": {
        "step1": {
            "title": "Informacije o Filijali",
                "description": "Unesite osnovne informacije o vašoj filijali",
                    "branchName": {
                "label": "Ime Filijale",
                    "placeholder": "Unesite ime filijale",
                        "error": "Ime filijale je obavezno"
            },
            "whatsappNumber": {
                "label": "WhatsApp Broj za Narudžbe ",
                    "placeholder": "555 123 4567",
                        "ariaLabel": "Pozivni Broj",
                            "errorRequired": "WhatsApp broj za narudžbe je obavezan",
                                "errorInvalid": "Nevažeći format broja telefona (7-15 cifara)."
            },
            "branchLogo": {
                "label": "Logo Filijale (Opcionalno)",
                    "success": "✓ Logo uspješno učitan",
                        "button": "Odaberi Logo",
                            "buttonUploading": "Učitavanje...",
                                "helper": "Podržani formati: PNG, JPG, GIF. Maksimalna veličina fajla: 5MB",
                                    "infoTitle": "Automatska Upotreba Loga",
                                        "infoDescription": "Ako ne učitate logo filijale, automatski će se koristiti logo restorana."
            }
        },
        "step2": {
            "title": "Informacije o Adresi",
                "description": "Unesite detalje adrese vaše filijale",
                    "country": {
                "label": "Država ",
                    "placeholder": "Unesite ime države",
                        "error": "Država je obavezna"
            },
            "city": {
                "label": "Grad",
                    "placeholder": "Unesite ime grada",
                        "error": "Grad je obavezan"
            },
            "street": {
                "label": "Ulica ",
                    "placeholder": "Unesite ime ulice",
                        "error": "Ulica je obavezna"
            },
            "zipCode": {
                "label": "Poštanski Broj ",
                    "placeholder": "Unesite poštanski broj",
                        "error": "Poštanski broj je obavezan"
            },
            "addressLine1": {
                "label": "Adresa 1",
                    "placeholder": "Unesite detaljnu adresu",
                        "error": "Adresa 1 je obavezna"
            },
            "addressLine2": {
                "label": "Adresa 2 ",
                    "placeholder": "Unesite dodatne informacije o adresi",
                        "error": "Adresa 2 je obavezna"
            }
        },
        "step3": {
            "title": "Kontakt Informacije",
                "description": "Unesite kontakt detalje vaše filijale",
                    "phone": {
                "label": "Broj Telefona *",
                    "placeholder": "212 123 4567",
                        "ariaLabel": "Pozivni Broj",
                            "errorRequired": "Broj telefona je obavezan",
                                "errorInvalid": "Nevažeći format broja telefona (7-15 cifara)."
            },
            "email": {
                "label": "Email Adresa *",
                    "placeholder": "Unesite email adresu",
                        "error": "Email adresa je obavezna"
            },
            "location": {
                "label": "Informacije o Lokaciji *",
                    "placeholder": "Unesite info o lokaciji (npr., 40.9795, 28.7225)",
                        "error": "Informacije o lokaciji su obavezne",
                            "selectOnMap": "Odaberi na Mapi",
                                "mapTitle": "Odaberi Lokaciju na Mapi",
                                    "useCurrentLocation": "Koristi Moju Trenutnu Lokaciju",
                                        "latitude": "Geografska Širina",
                                            "longitude": "Geografska Dužina",
                                                "googleMapsLink": "Google Maps Link (Opcionalno)",
                                                    "googleMapsLinkPlaceholder": "Zalijepite Google Maps link ovdje...",
                                                        "googleMapsLinkHelper": "Zalijepite Google Maps link i koordinate će biti automatski izvučene",
                                                            "invalidLink": "Nije moguće izvući koordinate iz ovog linka. Pokušajte drugi format.",
                                                                "interactiveMap": "Interaktivna Mapa",
                                                                    "clickToPin": "Kliknite na mapu da označite lokaciju",
                                                                        "markerPosition": "Pozicija Oznake",
                                                                            "openFullMap": "Otvori na punoj mapi",
                                                                                "manualCoordinates": "Ručne Koordinate",
                                                                                    "selectedCoordinates": "Odabrane Koordinate:",
                                                                                        "mapHelp": "Kako koristiti mapu:",
                                                                                            "mapHelp1": "Zalijepite Google Maps link u polje iznad",
                                                                                                "mapHelp2": "Ili kliknite \"Koristi Moju Trenutnu Lokaciju\"",
                                                                                                    "mapHelp3": "Ili unesite koordinate ručno",
                                                                                                        "mapHelp4": "Otvorite punu mapu da precizno označite lokaciju",
                                                                                                            "geolocationError": "Nije moguće dobiti vašu lokaciju. Molimo odaberite ručno.",
                                                                                                                "geolocationNotSupported": "Geolokacija nije podržana u vašem pretraživaču."
            },
            "contactHeader": {
                "label": "Zaglavlje Kontakta (Opcionalno)",
                    "placeholder": "Unesite zaglavlje kontakta (opcionalno)"
            },
            "footerTitle": {
                "label": "Naslov u Podnožju (Opcionalno)",
                    "placeholder": "Unesite naslov u podnožju (opcionalno)"
            },
            "footerDescription": {
                "label": "Opis u Podnožju (Opcionalno)",
                    "placeholder": "Unesite opis u podnožju (opcionalno)"
            },
            "openTitle": {
                "label": "Naslov Radnog Vremena (Opcionalno)",
                    "placeholder": "Unesite naslov radnog vremena (opcionalno)"
            },
            "openDays": {
                "label": "Radni Dani (Opcionalno)",
                    "placeholder": "Unesite radne dane (opcionalno)"
            },
            "openHours": {
                "label": "Radni Sati (Opcionalno)",
                    "placeholder": "Unesite radne sate (opcionalno)"
            },
            "workingHours": {
                "title": "Radno Vrijeme",
                    "description": "Postavite svoje radno vrijeme. Možete ostati otvoreni preko noći (npr., 23:00 - 02:00).",
                        "openLabel": "Vrijeme Otvaranja",
                            "closeLabel": "Vrijeme Zatvaranja",
                                "dayNames": [
                                    "Ponedjeljak",
                                    "Utorak",
                                    "Srijeda",
                                    "Četvrtak",
                                    "Petak",
                                    "Subota",
                                    "Nedjelja"
                                ],
                                    "toggleOpen": "Otvoreno",
                                        "toggleClosed": "Zatvoreno",
                                            "workingDayNote": "✓ Kupci mogu naručivati na ovaj dan",
                                                "overnightNote": "(Otvoreno preko noći)",
                                                    "error": {
                    "minOneDay": "Morate navesti radno vrijeme za barem jedan dan",
                        "allTimesRequired": "Morate navesti vrijeme otvaranja i zatvaranja za sve radne dane",
                            "invalidRange": "Nevažeći vremenski raspon: {openTime} - {closeTime}. Period preko noći ne može prelaziti 12 sati.",
                                "openBeforeClose": "Vrijeme otvaranja ({openTime}) mora biti prije vremena zatvaranja ({closeTime})"
                },
                "infoBox": {
                    "title": "O Radnom Vremenu",
                        "item1": "• Sati koje postavite ovdje određuju kada kupci mogu naručivati putem vašeg QR menija.",
                            "item2": "• Narudžbe se ne primaju na zatvorene dane, ali zatvoreni dani se također čuvaju u bazi podataka.",
                                "item3": "• Možete ostati otvoreni preko noći (npr., 23:00 - 02:00). Vrijeme zatvaranja će se primijeniti na sljedeći dan.",
                                    "item4": "• Maksimalni period otvaranja preko noći je 12 sati."
                }
            }
        }
    },
    "buttons": {
        "back": "Nazad",
            "next": "Sljedeće",
                "save": "Sačuvaj",
                    "saving": "Čuvanje...",
                        "cancel": "Otkaži",
                            "confirm": "Potvrdi"
    },
    "messages": {
        "errorTitle": "Greška",
            "successTitle": "Uspjeh",
                "successMessage": "Informacije o filijali uspješno sačuvane! Preusmjeravanje...",
                    "api": {
            "restaurantNotFound": "Informacije o restoranu nisu pronađene. Molimo kreirajte restoran ponovo.",
                "branchIdMissing": "Nije moguće dobiti ID filijale. Molimo pokušajte ponovo.",
                    "nameInUse": "Ovo ime filijale se već koristi. Molimo pokušajte drugo ime.",
                        "connectionError": "Nije moguće povezati se sa serverom. Molimo provjerite vašu internet vezu.",
                            "serverError": "Došlo je do greške na serveru. Molimo pokušajte ponovo kasnije ili provjerite podatke u formi.",
                                "genericCreateError": "Došlo je do greške prilikom registracije filijale. Molimo pokušajte ponovo.",
                                    "logoUploadError": "Došlo je do greške prilikom učitavanja loga. Molimo pokušajte ponovo."
        }
    }
},
extrasManagement: {
    title: 'Upravljanje Dodacima',
        description: 'Upravljajte kategorijama dodataka i njihovim stavkama',
            searchPlaceholder: 'Pretraži kategorije ili dodatke...',
                loading: 'Učitavanje...',
                    processing: 'Obrada...',

                        buttons: {
        add: 'Dodaj',
            edit: 'Uredi',
                delete: 'Izbriši',
                    save: 'Sačuvaj',
                        cancel: 'Otkaži',
                            close: 'Zatvori',
                                back: 'Nazad',
                                    done: 'Gotovo',
                                        addItem: 'Dodaj Stavku',
                                            createFirst: 'Kreiraj Prvu Stavku'
    },

    deleteModal: {
        titleCategory: 'Izbrisati Kategoriju?',
            titleItem: 'Izbrisati Stavku?',
                confirmMessage: 'Jeste li sigurni da želite izbrisati "{name}"?',
                    warningMessage: 'Ova radnja se ne može poništiti. Stavka će biti premještena u kantu za otpatke.',
                        confirmButton: 'Izbriši',
                            processingButton: 'Brisanje...',
                                cancelButton: 'Otkaži'
    },

    categories: {
        title: 'Kategorije Dodataka',
            addNew: 'Dodaj Novu Kategoriju',
                addCategory: 'Dodaj Novu Kategoriju',
                    editCategory: 'Uredi Kategoriju',
                        noCategories: 'Nema pronađenih kategorija',
                            tryAdjusting: 'Pokušajte prilagoditi pretragu ili dodajte novu kategoriju.',
                                select: 'Odaberi:',
                                    qtyLimit: 'Limit Količine:',
                                        active: 'Aktivno',
                                            inactive: 'Neaktivno',
                                                required: 'Obavezno',
                                                    fields: {
            categoryName: 'Ime Kategorije',
                categoryNamePlaceholder: 'npr., Dodaci za Pizzu',
                    description: 'Opis',
                        descriptionPlaceholder: 'Unesite opis kategorije (opcionalno)',
                            statusLabel: 'Status Aktivnosti',
                                requiredLabel: 'Da li je obavezno?',
                                    selectionRules: 'Pravila Odabira',
                                        removalCategoryLabel: 'Kategorija Uklanjanja',
                                            minSelection: 'Minimalni Odabir',
                                                maxSelection: 'Maksimalni Odabir',
                                                    minQuantity: 'Minimalna Količina',
                                                        maxQuantity: 'Maksimalna Količina',
                                                            unlimited: 'Neograničeno'
        }
    },

    extras: {
        title: 'Dodaci',
            addExtra: 'Dodaj Novi Dodatak',
                editExtra: 'Uredi Dodatak',
                    noItems: 'Još nema stavki u ovoj kategoriji.',
                        alreadyExists: 'Već Postoji',
                            noDescription: 'Nema opisa',
                                duplicateWarning: 'Dupli Dodatak',
                                    duplicateMessage: 'Ovaj dodatak već postoji u odabranoj kategoriji. Molimo odaberite drugo ime.',
                                        fields: {
            parentCategory: 'Roditeljska Kategorija',
                selectCategory: 'Odaberi Kategoriju...',
                    itemName: 'Ime Stavke',
                        itemNamePlaceholder: 'Ime stavke',
                            price: 'Cijena',
                                description: 'Opis',
                                    descriptionPlaceholder: 'Opcionalni detalji...',
                                        imageLabel: 'Slika Stavke',
                                            uploadText: 'Kliknite za učitavanje slike',
                                                activeLabel: 'Aktivno',
                                                    removalLabel: 'Stavka Uklanjanja (Oduzimanje)'
        }
    },

    productExtras: {
        manageCategories: 'Upravljaj Kategorijama Dodataka Proizvoda',
            manageExtras: 'Upravljaj Dodacima',
                addCategory: 'Dodaj Kategoriju',
                    addExtra: 'Dodaj Dodatak',
                        selectCategory: 'Odaberi Kategoriju',
                            chooseCategory: 'Odaberi Kategoriju...',
                                selectExtra: 'Odaberi Dodatak',
                                    chooseExtra: 'Odaberi Dodatak...',
                                        noCategoriesYet: 'Još nema dodanih kategorija',
                                            noExtrasYet: 'Još nema dodanih dodataka',
                                                noDescription: 'Opis nije dostupan',
                                                    addExtrasHint: 'Dodajte dodatke ovoj kategoriji koristeći dugme iznad.',
                                                        confirmDelete: 'Jeste li sigurni da želite izbrisati ovu kategoriju?',
                                                            confirmDeleteExtra: 'Jeste li sigurni da želite izbrisati ovaj dodatak?',
                                                                unknownCategory: 'Nepoznata Kategorija',
                                                                    unknownExtra: 'Nepoznat Dodatak',
                                                                        confirm: 'Potvrdi',
                                                                            selection: 'Odabir',
                                                                                quantity: 'Količina',
                                                                                    required : 'Obavezno',
                                                                                        optional: 'Opcionalno',
                                                                                            requiredShort: 'Obav.',
                                                                                                basePrice: 'Osnovna Cijena',
                                                                                                    unitPrice: 'Jedinična Cijena',
                                                                                                        selectionMode: 'Način Odabira',
                                                                                                            single: 'Jednostruki',
                                                                                                                multiple: 'Višestruki',
                                                                                                                    singleSelect: 'Jednostruki Odabir',
                                                                                                                        multiSelect: 'Višestruki Odabir',
                                                                                                                            requiredExtra: 'Obavezan Dodatak',
                                                                                                                                defaultQty: 'Zadana Kol.',
    default: 'Zadano',
            defaultShort: 'Zad.',
                minQty: 'Min Kol',
                    min: 'Min',
                        maxQty: 'Maks Kol',
                            max: 'Maks',
                                qty: 'Kol',
                                    quantities: 'Količine',
                                        quantityConfiguration: 'Konfiguracija Količine',
                                            priceAndSelection: 'Cijena i Odabir',
                                                minSelection: 'Min Odabir',
                                                    maxSelection: 'Maks Odabir',
                                                        minQuantity: 'Min Količina',
                                                            maxQuantity: 'Maks Količina',
                                                                selectionLimits: 'Limiti Odabira',
                                                                    quantityLimits: 'Limiti Količine',
                                                                        minSelectLabel: 'Min Odabir',
                                                                            maxSelectLabel: 'Maks Odabir',
                                                                                minTotalLabel: 'Min Ukupno',
                                                                                    maxTotalLabel: 'Maks Ukupno'
    },

    recycleBin: {
        title: 'Kanta za Otpatke',
            empty: 'Kanta za otpatke je prazna',
                restore: 'Vrati',
                    permanentDelete: 'Trajno Izbriši',
                        confirmRestore: 'Želite li vratiti "{name}"?',
                            confirmPermanentDelete: 'Želite li trajno izbrisati "{name}"? Ova radnja se ne može poništiti.'
    },

    errors: {
        loadCategories: 'Greška pri učitavanju kategorija',
            loadExtras: 'Greška pri učitavanju dodataka',
                uploadImage: 'Greška pri učitavanju slike',
                    deleteFailed: 'Neuspjelo brisanje stavke',
                        loadFailed: 'Neuspjelo učitavanje podataka',
                            saveFailed: 'Neuspjelo čuvanje podataka',
                                updateFailed: 'Neuspjelo ažuriranje podataka',
                                    restoreFailed: 'Neuspjelo vraćanje stavke'
    },

    success: {
        categoryAdded: 'Kategorija uspješno dodana',
            categoryUpdated: 'Kategorija uspješno ažurirana',
                categoryDeleted: 'Kategorija uspješno izbrisana',
                    extraAdded: 'Dodatak uspješno dodan',
                        extraUpdated: 'Dodatak uspješno ažuriran',
                            extraDeleted: 'Dodatak uspješno izbrisan',
                                restored: 'Uspješno vraćeno'
    },
    categoryConfigModal: {
        title: 'Konfiguriši Dodatke Filijale',
            productLabel: 'Konfigurisanje dodataka za:',
                searchPlaceholder: 'Pretraži kategorije...',

                    errors: {
            loadFailed: 'Neuspjelo učitavanje podataka konfiguracije',
                saveFailed: 'Neuspjelo čuvanje konfiguracije',
                    generic: 'Došlo je do greške'
        },
        stats: {
            selectedCategories: 'Kategorije',
                selectedExtras: 'Dodaci',
                    available: 'Ukupno Dostupno'
        },
        loading: {
            categories: 'Učitavanje kategorija i dodataka...'
        },
        empty: {
            noResults: 'Nijedna kategorija ne odgovara vašoj pretrazi',
                noCategories: 'Nema dostupnih kategorija dodataka'
        },
        badges: {
            required: 'Obavezno',
                optional: 'Opcionalno',
                    removal: 'Uklanjanje',
                        removalCategory: 'Kategorija Uklanjanja'
        },
        category: {
            availableExtras: 'dostupnih dodataka',
                configurationTitle: 'Pravila Kategorije',
                    selectExtrasTitle: 'Odaberi Dodatke',
                        selectCategoryWarning: 'Odaberite ovu kategoriju da biste omogućili odabir dodataka'
        },
        fields: {
            minSelection: 'Min Odabir',
                maxSelection: 'Maks Odabir',
                    minQuantity: 'Min Ukupna Kol',
                        maxQuantity: 'Maks Ukupna Kol',
                            overrideRequired: 'Obavezno',
                                specialPrice: 'Posebna Cijena',
                                    minQty: 'Min Kol',
                                        maxQty: 'Maks Kol',
                                            required: 'Obavezno'
        },
        labels: {
            originalPrice: 'Original',
                removesIngredient: 'Uklanja sastojak',
                    extraConfiguration: 'Konfiguracija Dodatka'
        },
        placeholders: {
            defaultPrice: 'Zadano'
        },
        messages: {
            removalPriceWarning: 'Cijena se ne može postaviti za dodatke uklanjanja'
        },
        footer: {
            categoriesSelected: 'odabranih kategorija',
                cancel: 'Otkaži',
                    save: 'Sačuvaj Promjene',
                        saving: 'Čuvanje...'
        }
    }

},
onboardingComplete: {
    "title": "Registracija Završena!",
        "message": "Informacije o vašem restoranu i filijali su uspješno sačuvane. Preusmjeravamo vas na stranicu za prijavu...",
            "redirectingIn": "sekundi do preusmjeravanja"
},
"countries": {
    "afghanistan": "Afganistan",
        "albania": "Albanija",
            "algeria": "Alžir",
                "andorra": "Andora",
                    "angola": "Angola",
                        "argentina": "Argentina",
                            "armenia": "Armenija",
                                "australia": "Australija",
                                    "austria": "Austrija",
                                        "azerbaijan": "Azerbejdžan",
                                            "bahamas": "Bahami",
                                                "bahrain": "Bahrein",
                                                    "bangladesh": "Bangladeš",
                                                        "barbados": "Barbados",
                                                            "belarus": "Bjelorusija",
                                                                "belgium": "Belgija",
                                                                    "belize": "Belize",
                                                                        "benin": "Benin",
                                                                            "bhutan": "Butan",
                                                                                "bolivia": "Bolivija",
                                                                                    "bosnia": "Bosna i Hercegovina",
                                                                                        "botswana": "Bocvana",
                                                                                            "brazil": "Brazil",
                                                                                                "brunei": "Brunej",
                                                                                                    "bulgaria": "Bugarska",
                                                                                                        "burkina_faso": "Burkina Faso",
                                                                                                            "burundi": "Burundi",
                                                                                                                "cambodia": "Kambodža",
                                                                                                                    "cameroon": "Kamerun",
                                                                                                                        "canada": "Kanada",
                                                                                                                            "cape_verde": "Zelenortska Ostrva",
                                                                                                                                "central_african_republic": "Centralnoafrička Republika",
                                                                                                                                    "chad": "Čad",
                                                                                                                                        "chile": "Čile",
                                                                                                                                            "china": "Kina",
                                                                                                                                                "colombia": "Kolumbija",
"comoros": "Komori",
    "congo": "Kongo",
        "costa_rica": "Kostarika",
            "croatia": "Hrvatska",
                "cuba": "Kuba",
                    "cyprus": "Kipar",
                        "czech_republic": "Češka Republika",
                            "denmark": "Danska",
                                "djibouti": "Džibuti",
                                    "dominica": "Dominika",
                                        "dominican_republic": "Dominikanska Republika",
                                            "ecuador": "Ekvador",
                                                "egypt": "Egipat",
                                                    "el_salvador": "El Salvador",
                                                        "equatorial_guinea": "Ekvatorijalna Gvineja",
                                                            "eritrea": "Eritreja",
                                                                "estonia": "Estonija",
                                                                    "ethiopia": "Etiopija",
                                                                        "fiji": "Fidži",
                                                                            "finland": "Finska",
                                                                                "france": "Francuska",
                                                                                    "gabon": "Gabon",
                                                                                        "gambia": "Gambija",
                                                                                            "georgia": "Gruzija",
                                                                                                "germany": "Njemačka",
                                                                                                    "ghana": "Gana",
                                                                                                        "greece": "Grčka",
                                                                                                            "grenada": "Grenada",
                                                                                                                "guatemala": "Gvatemala",
                                                                                                                    "guinea": "Gvineja",
                                                                                                                        "guinea_bissau": "Gvineja Bisau",
                                                                                                                            "guyana": "Gvajana",
                                                                                                                                "haiti": "Haiti",
                                                                                                                                    "honduras": "Honduras",
                                                                                                                                        "hungary": "Mađarska",
                                                                                                                                            "iceland": "Island",
                                                                                                                                                "india": "Indija",
                                                                                                                                                    "indonesia": "Indonezija",
                                                                                                                                                        "iran": "Iran",
                                                                                                                                                            "iraq": "Irak",
                                                                                                                                                                "ireland": "Irska",
                                                                                                                                                                    "italy": "Italija",
                                                                                                                                                                        "jamaica": "Jamajka",
                                                                                                                                                                            "japan": "Japan",
                                                                                                                                                                                "jordan": "Jordan",
                                                                                                                                                                                    "kazakhstan": "Kazahstan",
                                                                                                                                                                                        "kenya": "Kenija",
                                                                                                                                                                                            "kiribati": "Kiribati",
                                                                                                                                                                                                "kuwait": "Kuvajt",
                                                                                                                                                                                                    "kyrgyzstan": "Kirgistan",
                                                                                                                                                                                                        "laos": "Laos",
                                                                                                                                                                                                            "latvia": "Latvija",
                                                                                                                                                                                                                "lebanon": "Libanon",
                                                                                                                                                                                                                    "lesotho": "Lesoto",
                                                                                                                                                                                                                        "liberia": "Liberija",
                                                                                                                                                                                                                            "libya": "Libija",
                                                                                                                                                                                                                                "liechtenstein": "Lihtenštajn",
                                                                                                                                                                                                                                    "lithuania": "Litvanija",
                                                                                                                                                                                                                                        "luxembourg": "Luksemburg",
                                                                                                                                                                                                                                            "madagascar": "Madagaskar",
                                                                                                                                                                                                                                                "malawi": "Malavi",
                                                                                                                                                                                                                                                    "malaysia": "Malezija",
                                                                                                                                                                                                                                                        "maldives": "Maldivi",
                                                                                                                                                                                                                                                            "mali": "Mali",
                                                                                                                                                                                                                                                                "malta": "Malta",
                                                                                                                                                                                                                                                                    "marshall_islands": "Maršalska Ostrva",
                                                                                                                                                                                                                                                                        "mauritania": "Mauritanija",
                                                                                                                                                                                                                                                                            "mauritius": "Mauricijus",
                                                                                                                                                                                                                                                                                "mexico": "Meksiko",
                                                                                                                                                                                                                                                                                    "micronesia": "Mikronezija",
                                                                                                                                                                                                                                                                                        "moldova": "Moldavija",
                                                                                                                                                                                                                                                                                            "monaco": "Monako",
                                                                                                                                                                                                                                                                                                "mongolia": "Mongolija",
                                                                                                                                                                                                                                                                                                    "montenegro": "Crna Gora",
                                                                                                                                                                                                                                                                                                        "morocco": "Maroko",
                                                                                                                                                                                                                                                                                                            "mozambique": "Mozambik",
                                                                                                                                                                                                                                                                                                                "myanmar": "Mjanmar",
                                                                                                                                                                                                                                                                                                                    "namibia": "Namibija",
                                                                                                                                                                                                                                                                                                                        "nauru": "Nauru",
                                                                                                                                                                                                                                                                                                                            "nepal": "Nepal",
                                                                                                                                                                                                                                                                                                                                "netherlands": "Holandija",
                                                                                                                                                                                                                                                                                                                                    "new_zealand": "Novi Zeland",
                                                                                                                                                                                                                                                                                                                                        "nicaragua": "Nikaragva",
                                                                                                                                                                                                                                                                                                                                            "niger": "Niger",
                                                                                                                                                                                                                                                                                                                                                "nigeria": "Nigerija",
                                                                                                                                                                                                                                                                                                                                                    "north_korea": "Sjeverna Koreja",
                                                                                                                                                                                                                                                                                                                                                        "north_macedonia": "Sjeverna Makedonija",
                                                                                                                                                                                                                                                                                                                                                            "norway": "Norveška",
                                                                                                                                                                                                                                                                                                                                                                "oman": "Oman",
                                                                                                                                                                                                                                                                                                                                                                    "pakistan": "Pakistan",
                                                                                                                                                                                                                                                                                                                                                                        "palau": "Palau",
                                                                                                                                                                                                                                                                                                                                                                            "palestine": "Palestina",
                                                                                                                                                                                                                                                                                                                                                                                "panama": "Panama",
                                                                                                                                                                                                                                                                                                                                                                                    "papua_new_guinea": "Papua Nova Gvineja",
                                                                                                                                                                                                                                                                                                                                                                                        "paraguay": "Paragvaj",
                                                                                                                                                                                                                                                                                                                                                                                            "peru": "Peru",
                                                                                                                                                                                                                                                                                                                                                                                                "philippines": "Filipini",
                                                                                                                                                                                                                                                                                                                                                                                                    "poland": "Poljska",
                                                                                                                                                                                                                                                                                                                                                                                                        "portugal": "Portugal",
                                                                                                                                                                                                                                                                                                                                                                                                            "qatar": "Katar",
                                                                                                                                                                                                                                                                                                                                                                                                                "romania": "Rumunija",
                                                                                                                                                                                                                                                                                                                                                                                                                    "russia": "Rusija",
                                                                                                                                                                                                                                                                                                                                                                                                                        "rwanda": "Ruanda",
                                                                                                                                                                                                                                                                                                                                                                                                                            "saint_kitts": "Sveti Kristofor i Nevis",
                                                                                                                                                                                                                                                                                                                                                                                                                                "saint_lucia": "Sveta Lucija",
                                                                                                                                                                                                                                                                                                                                                                                                                                    "saint_vincent": "Sveti Vincent i Grenadini",
                                                                                                                                                                                                                                                                                                                                                                                                                                        "samoa": "Samoa",
                                                                                                                                                                                                                                                                                                                                                                                                                                            "san_marino": "San Marino",
                                                                                                                                                                                                                                                                                                                                                                                                                                                "sao_tome": "Sao Tome i Principe",
                                                                                                                                                                                                                                                                                                                                                                                                                                                    "saudi_arabia": "Saudijska Arabija",
                                                                                                                                                                                                                                                                                                                                                                                                                                                        "senegal": "Senegal",
                                                                                                                                                                                                                                                                                                                                                                                                                                                            "serbia": "Srbija",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                "seychelles": "Sejšeli",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "sierra_leone": "Sijera Leone",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "singapore": "Singapur",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "slovakia": "Slovačka",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "slovenia": "Slovenija",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "solomon_islands": "Solomonska Ostrva",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "somalia": "Somalija",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "south_africa": "Južna Afrika",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "south_korea": "Južna Koreja",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "south_sudan": "Južni Sudan",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "spain": "Španija",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "sri_lanka": "Šri Lanka",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "sudan": "Sudan",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "suriname": "Surinam",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "sweden": "Švedska",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "switzerland": "Švicarska",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "syria": "Sirija",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "taiwan": "Tajvan",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "tajikistan": "Tadžikistan",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "tanzania": "Tanzanija",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "thailand": "Tajland",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "timor_leste": "Istočni Timor",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "togo": "Togo",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "tonga": "Tonga",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "trinidad": "Trinidad i Tobago",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "tunisia": "Tunis",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "turkey": "Turska",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "turkmenistan": "Turkmenistan",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "tuvalu": "Tuvalu",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "uganda": "Uganda",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "ukraine": "Ukrajina",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "uae": "Ujedinjeni Arapski Emirati",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "united_kingdom": "Ujedinjeno Kraljevstvo",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "united_states": "Sjedinjene Američke Države",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "uruguay": "Urugvaj",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "uzbekistan": "Uzbekistan",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "vanuatu": "Vanuatu",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "vatican": "Vatikan",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "venezuela": "Venecuela",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            "vietnam": "Vijetnam",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                "yemen": "Jemen",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "zambia": "Zambija",
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        "zimbabwe": "Zimbabve"
  },

// Legal Pages
legal: {
    terms: {
        title: 'Uslovi Korištenja',
            lastUpdated: 'Zadnje Ažurirano: Decembar 2025',
                sections: {
            introduction: {
                title: '1. Uvod',
                    content: 'Dobrodošli u QR Menu ("mi", "nas" ili "naš"). Ovi Uslovi Korištenja ("Uslovi") uređuju vaš pristup i korištenje naše platforme digitalnog menija i usluga. Pristupanjem ili korištenjem naših usluga, pristajete da budete obavezani ovim Uslovima. Ako se ne slažete sa bilo kojim dijelom ovih Uslova, ne možete koristiti naše usluge.'
            },
            acceptance: {
                title: '2. Prihvatanje Uslova',
                    content: 'Kreiranjem naloga, pristupanjem našoj platformi ili korištenjem bilo koje od naših usluga, potvrđujete da ste pročitali, razumjeli i pristajete da budete obavezani ovim Uslovima i našom Politikom Privatnosti. Ovi Uslovi se primjenjuju na sve korisnike usluge, uključujući restorane, vlasnike restorana, osoblje i krajnje kupce.'
            },
            services: {
                title: '3. Opis Usluga',
                    content: 'QR Menu pruža sveobuhvatno rješenje digitalnog menija za restorane i preduzeća za usluživanje hrane. Naše usluge uključuju, ali nisu ograničene na:',
                        features: {
                    0: 'Kreiranje i upravljanje digitalnim menijem',
                        1: 'Generisanje QR koda za naručivanje za stolom i za ponijeti',
                            2: 'Sistem za upravljanje i praćenje narudžbi',
                                3: 'Alati za analitiku i izvještavanje'
                }
            },
            userResponsibilities: {
                title: '4. Odgovornosti Korisnika',
                    content: 'Kao korisnik QR Menu-a, slažete se da ćete:',
                        items: {
                    0: 'Pružiti tačne i potpune informacije prilikom kreiranja naloga',
                        1: 'Održavati sigurnost i povjerljivost vaših pristupnih podataka',
                            2: 'Koristiti uslugu u skladu sa svim primjenjivim zakonima i propisima',
                                3: 'Ne koristiti uslugu u bilo kakve nezakonite, štetne ili lažne svrhe'
                }
            },
            payment: {
                title: '5. Uslovi Plaćanja',
                    content: 'Naknade za pretplatu se naplaćuju unaprijed na mjesečnoj ili godišnjoj osnovi, zavisno o odabranom planu. Sve naknade su nepovratne osim ako zakon nalaže drugačije. Zadržavamo pravo izmjene naših cijena uz obavijest od 30 dana postojećim korisnicima. Neplaćanje naknada može rezultirati suspenzijom ili gašenjem vašeg naloga.'
            },
            termination: {
                title: '6. Raskid',
                    content: 'Možete ugasiti svoj nalog u bilo kojem trenutku putem postavki naloga. Zadržavamo pravo da suspendujemo ili ugasimo vaš nalog ako prekršite ove Uslove ili se uključite u aktivnosti koje štete našoj usluzi ili drugim korisnicima. Nakon raskida, vaše pravo na korištenje usluge odmah prestaje, iako će određene odredbe ovih Uslova preživjeti raskid.'
            },
            intellectualProperty: {
                title: '7. Intelektualno Vlasništvo',
                    content: 'Sav sadržaj, karakteristike i funkcionalnosti QR Menu-a, uključujući, ali ne ograničavajući se na tekst, grafiku, logotipe i softver, u vlasništvu su nas ili naših davatelja licence i zaštićeni su međunarodnim zakonima o autorskim pravima, zaštitnim znakovima i drugim zakonima o intelektualnom vlasništvu. Ne smijete kopirati, mijenjati, distribuirati ili kreirati izvedena djela na osnovu naše usluge bez naše izričite pismene dozvole.'
            },
            liability: {
                title: '8. Ograničenje Odgovornosti',
                    content: 'U maksimalnoj mjeri dopuštenoj zakonom, QR Menu i njegove podružnice neće biti odgovorni za bilo kakvu indirektnu, slučajnu, posebnu, posljedičnu ili kaznenu štetu koja proistekne iz vašeg korištenja ili nemogućnosti korištenja usluge. Naša ukupna odgovornost za bilo kakve zahtjeve koji proizlaze iz ovih Uslova ili vašeg korištenja usluge neće prelaziti iznos koji ste nam platili u dvanaest mjeseci koji su prethodili zahtjevu.'
            },
            changes: {
                title: '9. Promjene Uslova',
                    content: 'Zadržavamo pravo izmjene ovih Uslova u bilo kojem trenutku. Obavijestit ćemo korisnike o svim materijalnim promjenama putem emaila ili putem naše platforme. Vaše kontinuirano korištenje usluge nakon takvih izmjena predstavlja vaše prihvatanje ažuriranih Uslova. Preporučujemo vam da povremeno pregledate ove Uslove.'
            },
            contact: {
                title: 'Kontaktirajte Nas',
                    content: 'Ako imate bilo kakvih pitanja o ovim Uslovima Korištenja, molimo kontaktirajte nas na:'
            }
        }
    },
    privacy: {
        title: 'Politika Privatnosti',
            lastUpdated: 'Zadnje Ažurirano: Decembar 2025',
                sections: {
            introduction: {
                title: '1. Uvod',
                    content: 'U QR Menu-u ozbiljno shvaćamo vašu privatnost. Ova Politika Privatnosti objašnjava kako prikupljamo, koristimo, otkrivamo i čuvamo vaše informacije kada koristite našu platformu digitalnog menija. Korištenjem naših usluga pristajete na prakse podataka opisane u ovoj politici.'
            },
            dataCollection: {
                title: '2. Informacije Koje Prikupljamo',
                    content: 'Prikupljamo nekoliko vrsta informacija kako bismo pružili i poboljšali naše usluge:',
                        items: {
                    0: 'Lične Informacije: Ime, email adresa, broj telefona i detalji o poslovanju pruženi prilikom registracije',
                        1: 'Poslovne Informacije: Detalji o restoranu, stavke menija, cijene i operativni podaci',
                            2: 'Podaci o Korištenju: Informacije o tome kako interakujete s našom platformom, uključujući vremena pristupa i korištene funkcije',
                                3: 'Informacije o Uređaju: IP adresa, tip pretraživača, operativni sistem i identifikatori uređaja',
                                    4: 'Informacije o Plaćanju: Detalji naplate i historija transakcija (obrađeno sigurno putem trećih strana pružatelja plaćanja)'
                }
            },
            dataUsage: {
                title: '3. Kako Koristimo Vaše Informacije',
                    content: 'Prikupljene informacije koristimo u različite svrhe:',
                        items: {
                    0: 'Da bismo pružili, održavali i poboljšali naše usluge',
                        1: 'Da bismo obradili transakcije i poslali povezane informacije',
                            2: 'Da bismo poslali administrativne informacije, ažuriranja i sigurnosna upozorenja',
                                3: 'Da bismo odgovorili na zahtjeve korisničke službe i potrebe podrške',
                                    4: 'Da bismo analizirali obrasce korištenja i optimizirali korisničko iskustvo'
                }
            },
            dataSecurity: {
                title: '4. Sigurnost Podataka',
                    content: 'Primjenjujemo industrijske standarde sigurnosnih mjera za zaštitu vaših informacija, uključujući enkripciju, sigurne servere i redovne sigurnosne revizije. Međutim, nijedan način prijenosa putem interneta nije 100% siguran i ne možemo garantovati apsolutnu sigurnost vaših podataka. Preporučujemo vam da koristite jake lozinke i čuvate povjerljivost podataka vašeg naloga.'
            },
            dataSharing: {
                title: '5. Dijeljenje i Otkrivanje Podataka',
                    content: 'Ne prodajemo vaše lične informacije. Vaše informacije možemo podijeliti samo u sljedećim okolnostima:',
                        items: {
                    0: 'Sa pružaocima usluga koji pomažu u radu naše platforme (pod strogim ugovorima o povjerljivosti)',
                        1: 'Kada to zakon zahtijeva ili radi zaštite naših zakonskih prava',
                            2: 'U vezi s poslovnim prijenosom, spajanjem ili akvizicijom (uz prethodnu obavijest korisnicima)'
                }
            },
            cookies: {
                title: '6. Kolačići i Tehnologije Praćenja',
                    content: 'Koristimo kolačiće i slične tehnologije praćenja kako bismo poboljšali vaše iskustvo, analizirali obrasce korištenja i isporučili personalizirani sadržaj. Postavke kolačića možete kontrolirati putem postavki vašeg pretraživača, iako onemogućavanje kolačića može ograničiti određene funkcije naše usluge.'
            },
            userRights: {
                title: '7. Vaša Prava',
                    content: 'Imate određena prava u vezi s vašim ličnim informacijama:',
                        items: {
                    0: 'Pristup: Zatražite kopiju ličnih informacija koje imamo o vama',
                        1: 'Ispravka: Zatražite ispravku netačnih ili nepotpunih informacija',
                            2: 'Brisanje: Zatražite brisanje vaših ličnih informacija (podložno zakonskim obavezama)',
                                3: 'Prenosivost Podataka: Zatražite prijenos vaših podataka na drugu uslugu',
                                    4: 'Odjava: Odjavite se od marketinških komunikacija u bilo kojem trenutku'
                }
            },
            childrenPrivacy: {
                title: '8. Privatnost Djece',
                    content: 'Naše usluge nisu namijenjene osobama mlađim od 18 godina. Ne prikupljamo svjesno lične informacije od djece. Ako saznamo da smo prikupili informacije od djeteta bez pristanka roditelja, poduzet ćemo korake da te informacije izbrišemo.'
            },
            changes: {
                title: '9. Promjene ove Politike Privatnosti',
                    content: 'Ovu Politiku Privatnosti možemo povremeno ažurirati kako bismo odrazili promjene u našim praksama ili zakonskim zahtjevima. Obavijestit ćemo vas o svim materijalnim promjenama objavljivanjem ažurirane politike na našoj platformi i ažuriranjem datuma "Zadnje Ažurirano". Preporučujemo vam da povremeno pregledate ovu politiku.'
            },
            contact: {
                title: 'Kontaktirajte Nas',
                    content: 'Ako imate bilo kakvih pitanja ili nedoumica o ovoj Politici Privatnosti ili našim praksama podataka, molimo kontaktirajte nas na:'
            }
        }
    }
},

// Multi-Language System
multiLanguage: {
    noLanguagesConfigured: 'Nema konfigurisanih jezika. Molimo konfigurišite jezike u postavkama.',
        required: 'Obavezno',
            quickFill: 'Brzo Popunjavanje',
                currentLanguage: 'Trenutni Jezik',
                    fieldRequired: 'Ovo polje je obavezno'
},
RestaurantPreferencesTab: {
    title: 'Jezičke Postavke Restorana',
        subtitle: 'Upravljajte jezičkim postavkama restorana',
            loading: 'Učitavanje...',
                buttons: {
        refresh: 'Osvježi',
            save: 'Sačuvaj Promjene',
                saving: 'Čuvanje...'
    },
    sections: {
        languageSettings: {
            title: 'Postavke Jezika',
                subtitle: 'Postavite jezike koje podržava vaš restoran i zadani jezik'
        },
        currencySettings: {
            title: 'Postavke Valute',
                subtitle: 'Postavite zadanu valutu za vaš restoran'
        }
    },
    form: {
        defaultLanguage: {
            label: 'Zadani Jezik',
                helperText: 'Postavka zadanog jezika za restoran'
        },
        defaultCurrency: {
            label: 'Zadana Valuta',
                helperText: 'Postavka zadane valute za restoran'
        },
        supportedLanguages: {
            label: 'Podržani Jezici',
                helperText: 'Najmanje jedan jezik mora biti odabran. Zadani jezik ostaje automatski odabran.'
        }
    },
    alerts: {
        success: 'Postavke restorana uspješno ažurirane',
            cascadeWarning: {
            title: 'Važna Napomena:',
                description: 'Kada smanjite podržane jezike, postavke filijala se automatski ažuriraju:',
                    point1: 'Filijale mogu podržavati samo jezike koje podržava restoran',
                        point2: 'Ako je zadani jezik filijale uklonjen, ažurira se na zadani jezik restorana'
        },
        validationInfo: {
            title: 'Pravila Validacije:',
                point1: 'Najmanje jedan jezik mora biti podržan',
                    point2: 'Zadani jezik mora biti među podržanim jezicima'
        }
    },
    errors: {
        load: 'Greška pri učitavanju postavki restorana',
            loadGeneral: 'Postavke restorana nisu mogle biti učitane',
                save: 'Greška pri čuvanju postavki restorana'
    }
},
BranchTableModal: {
    'addTitle': 'Dodaj Novi Stol',
        'editTitle': 'Uredi Stol',
            'addSubtitle': 'Kreiraj novi stol',
                'tableNamePlaceholder': 'Unesite ime stola',
                    'capacity': 'Kapacitet',
                        'tableName': 'Ime Stola',
                            'cancel': 'Otkaži',
                                'tableNameRequired': 'Ime stola je obavezno',
                                    'capacityRequired': 'Kapacitet mora biti najmanje 1',
                                        'editSubtitle': 'Ažuriraj detalje stola',
                                            'add': 'Dodaj Stol',
                                                'capacityPlaceholder': 'Unesite kapacitet',
                                                    'saving': 'Čuvanje...',
                                                        'status': 'Status Stola',
                                                            'active': 'Stol je aktivan',
                                                                'inactive': 'Stol je neaktivan',
                                                                    'update': 'Ažuriraj Stol',
                                                                        'invalidData': 'Pruženi su nevažeći podaci',
                                                                            'errorOccurred': 'Došlo je do greške',
                                                                                'accessibility': {
        'modal': 'Modal Stola',
            'close': 'Zatvori'
    }
},

languageControl: {
    editing: 'Uređivanje',
        copyFrom: 'Kopiraj sve iz',
            quickFill: 'Brzo Popuni Ostale Jezike...',
                fill: 'Popuni',

                    bulkFillTitle: 'Masovno Popuni Ciljni Jezik',
                        scrollLeft: 'Pomjeri lijevo',
                            scrollRight: 'Pomjeri desno'
},
paymentMethod: {
    cash: 'Gotovina',
        creditCard: 'Kreditna Kartica',
            online: 'Online Plaćanje'
},

};
