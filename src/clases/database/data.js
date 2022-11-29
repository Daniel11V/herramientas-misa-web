
export const database = {
    authors: {
        123455: {
            id: '123455',
            name: 'Facundo Etcheberry',
            email: '',
            photoUrl: '',
            creatorId: '111418653738749034139',
            songTitleIds: ["123", "124"],
        },
        123456: {
            id: '123456',
            name: 'Athenas',
            email: '',
            photoUrl: '',
            creatorId: '111418653738749034139',
            songTitleIds: ["123", "124"],
        },
    },
    userList: {
        '111418653738749034139': {
            id: '111418653738749034139',
            name: 'Daniel Vinet',
            email: '',
            photoUrl: '',
        },
        '123457': {
            id: '123457',
            name: 'Alex Vinet',
            email: '',
            photoUrl: '',
        }
    },

    privateRepertoryList: {
        "6144d6372d6d4f8085af95ee": {
            "id": "6144d6372d6d4f8085af95ee",
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            "title": "Misa 250 Años de la Parroquia",
            "description": "",
            "members": [],
            "placeTitle": "Parroquia Ntra. Sra. del Pilar",
            "placeUbication": "",
            "isMass": true,
            "songs": {
                "entrada": [""],
                "gloria": [""],
                "aleluya": [""],
                "ofrenda": [""],
                "santo": [""],
                "cordero": [""],
                "comunion": [""],
                "meditacion": [""],
                "salida": [""],
            }
        },
        "6144d6373d6d4f8085af95ee": {
            "id": "6144d6373d6d4f8085af95ee",
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            "title": "Misa Sábado 20hs",
            "description": "",
            "members": [],
            "placeTitle": "Parroquia Ntra. Sra. del Pilar",
            "placeUbication": "",
            "isMass": true,
            "songs": {
                "entrada": [""],
                "gloria": [""],
                "aleluya": [""],
                "ofrenda": [""],
                "santo": [""],
                "cordero": [""],
                "comunion": [""],
                "meditacion": [""],
                "salida": [""],
            }
        }
    },

    privateSongTitleList: {
        "6144d6372d6d4f8085af95ee": {
            "id": "6144d6372d6d4f8085af95ee",
            "versionGroupId": "6144d6372d6d4f8085af95ed",
            "isPrivate": true,
            "lyricId": "6144d6372d6d4f8085af95ee",
            "lyricIsPrivate": true,
            "title": "Aleluya III",
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            "hasAccess": {
                "123457": "Alex Vinet",
            },
            "labels": ["aleluya"],
            "topics": [],
            "rating": [],
            "level": {
                main: 3,
                voice: 3,
                guitar: 3,
            },
            "pulse": "4/4 por acorde",
            // "chords": {
            //     "5": { "0": "DO", "5": "SOL", "14": "LAm", "25": "MIm" }, "6": { "0": "FA", "5": "DO", "13": "RE7", "17": "SOL" }, "7": { "0": "DO", "5": "SOL", "14": "LAm", "25": "MIm" }, "8": { "0": "FA", "5": "DO", "13": "SOL", "17": "DO" }
            // },
        }
    },
    privateSongLyricList: {
        "6144d6372d6d4f8085af95ee": {
            // songTitleId: "6144d6372d6d4f8085af95ee",
            lyric: "Busca primero el Reino de Dios\ny su perfecta justicia,\ny lo demás añadido será.  \nAleluya, aleluuuuuuya.\n\nAleluya,   aleluya, aleluya\nAleluya,  aleluuuya\nAleluya,   aleluya, aleluya\nAleluya,  aleluuuya\n\nOtras antífonas:\nCanto a la vida que Cristo regaló \ncambiando su historia\ncuando en la cruz él murió por nuestro amor.\nAleluya, aleluya.\n\nCanto por Cristo que nos liberará \ncuando él venga en la gloria\ncuando la vida por él renacerá. \nAleluya, aleluya."
        },
    },

    publicRepertoryList: {},

    publicSongTitleList: {
        "123": {
            "id": "123",
            "versionGroupId": "123",
            "isPrivate": false,
            "lyricId": "123",
            "lyricIsPrivate": false,
            "title": "Espíritu de Verdad",
            "author": {
                "id": "123455",
                "name": "Facundo Etcheberry",
            },
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            "labels": [],
            "topics": [],
            "rating": [],
            "level": { main: 1 },
        },
        "124": {
            "id": "124",
            "versionGroupId": "124",
            "isPrivate": false,
            "lyricId": "124",
            "lyricIsPrivate": false,
            "title": "Todo Poder y Gloria",
            "author": {
                "id": "123455",
                "name": "Facundo Etcheberry",
            },
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            "labels": [],
            "topics": [],
            "rating": [],
            "level": { main: 1 },
        },
        "125": {
            "id": "125",
            "versionGroupId": "125",
            "isPrivate": false,
            "lyricId": "125",
            "lyricIsPrivate": false,
            "title": "Recibe mi corazón",
            "author": {
                "id": "123454",
                "name": "Verónica Sanfilipo",
            },
            "creator": {
                "id": "0",
                "name": "",
            },
            "labels": [],
            "topics": [],
            "rating": [],
            "level": { main: 1 },
        },
        "613c854ef601f09e344f43bf": {
            "id": "613c854ef601f09e344f43bf",
            "versionGroupId": "613c854ef601f09e344f43bf",
            "isPrivate": false,
            "lyricId": "613c854ef601f09e344f43bf",
            "lyricIsPrivate": false,
            "title": "A Él la gloria",
            "author": {
                "id": "123453",
                "name": "Efatá",
            },
            "creator": {
                "id": "0",
                "name": "",
            },
            "labels": ["jesus"],
            "topics": [],
            "rating": [],
            "level": { main: 1 },
        },
        "613c8597f601f09e344f43c2": {
            "id": "613c8597f601f09e344f43c2",
            "versionGroupId": "613c8597f601f09e344f43c2",
            "isPrivate": false,
            "lyricId": "613c8597f601f09e344f43c2",
            "lyricIsPrivate": false,
            "title": "A casa de Zacarí­as",
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            "topics": [],
            "labels": [],
            "rating": [],
            "level": { main: 1 },
        },
        "6144d3152d6d4f8085af95d9": {
            "id": "6144d3152d6d4f8085af95d9",
            "versionGroupId": "6144d3152d6d4f8085af95d9",
            "isPrivate": false,
            "lyricId": "6144d3152d6d4f8085af95d9",
            "lyricIsPrivate": false,
            "title": "Al contemplarte en la Cruz",
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            "topics": [],
            "labels": [],
            "rating": [],
            "level": { main: 1 },
        },
        "6144d6372d6d4f8085af95ed": {
            "id": "6144d6372d6d4f8085af95ed",
            "versionGroupId": "6144d6372d6d4f8085af95ed",
            "isPrivate": false,
            "lyricId": "6144d6372d6d4f8085af95ed",
            "lyricIsPrivate": false,
            "title": "Aleluya II (Busca primero el Reino de Dios)",
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            "topics": [],
            "labels": ["aleluya"],
            "rating": [],
            "level": { main: 1 },
        },
        '1669486125378': {
            id: "1669486125378",
            versionGroupId: "1669486125378",
            "isPrivate": false,
            "lyricId": "1669486125376",
            "lyricIsPrivate": false,
            title: 'Despertemos llega Cristo',
            author: '',
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            labels: [
                'adviento',
                'navidad'
            ],
            pulse: '',
            tempo: '',
            level: {
                main: 1
            },
        },
        '1669487158543': {
            id: '1669487158543',
            versionGroupId: '1669487158543',
            "isPrivate": false,
            "lyricId": "1669487158540",
            "lyricIsPrivate": false,
            title: 'Saber que vendrás',
            author: '',
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            labels: [
                'ofrenda'
            ],
            pulse: '',
            tempo: '',
            level: {
                main: 1
            },
        },
        '1669487612348': {
            id: '1669487612348',
            versionGroupId: '1669487612348',
            "isPrivate": false,
            "lyricId": "1669487612347",
            "lyricIsPrivate": false,
            title: 'María de la Esperanza',
            author: '',
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            labels: [
                'comunion'
            ],
            pulse: '',
            tempo: '',
            level: {
                main: 1
            },
        },
        '1669487992788': {
            id: '1669487992788',
            versionGroupId: '1669487992788',
            "isPrivate": false,
            "lyricId": "1669487992786",
            "lyricIsPrivate": false,
            title: 'Toda la tierra',
            author: '',
            "creator": {
                "id": "111418653738749034139",
                "name": "Daniel Vinet",
            },
            labels: [
                'meditacion'
            ],
            pulse: '',
            tempo: '',
            level: {
                main: 1
            },
        }
    },
    publicSongLyricList: {
        "123": {
            // songTitleId: "123",
            lyric: `D                                      Em7
En tormentas, en mi oscuridad
             G                     D
Infunde tu luz, trae la calma
D                                      Em7
Purifícame y lávame de aquello
               G                   D
que me aleja de ti

G     A           Bm7
Ven Santo Espíritu
Em              A
Ven con tu unción

[Estribillo]
D                             Em7
Espíritu de verdad, Espíritu de vida
G                        D
Consolador ven a mi vida   x2

          Em7                            A
Ven Espíritu de amor, sopla en mi corazón
Bm7  A               G              D
                Ven Espíritu de amor

D                                           Em7
Hazme mirar con tus ojos Señor
               G                     D
También amar como tú amas
D                                             Bm7
Quiero agradarte en todo lo que yo haga
               Em7                     A
Quiero anunciar como me amas

          G       A          Bm7
Y por eso recurro a ti,
C                         A
ya que de mi no salen las palabras

Estribillo --
Em7               A
Ven Espíritu de amor

   E                              F#m7
Espíritu de Verdad, Espíritu de vida
A                                E
Consolador ven a mí vida  x4

           A           
Ven Espíritu de amor, 
          Am               E9
sopla en mi corazón`,
        },
        "124": {
            // songTitleId: "124",
            lyric: `           E                B
Tu presencia es real
         F#m             A
todo Dios en el altar
               A            E
Seas bendito y alabado
   F#m               B
Jesús sacramentado

Rey eterno presente estás
por amor a la humanidad
Seas por siempre alabado
mi Dios sacramentado

                 C#m  G#m
Todo el poder y gloria
       A                     Am
por siempre sea a ti.
               F#m       E
Seas bendito y alabado
   F#m               B
Jesús sacramentado`,
        },
        "125": {
            // songTitleId: "125",
            lyric: `D              G
En la intimidad de tu presencia
     D                      G
Te rindo hoy mi ser y mi corazón
       Bm      A        G9            D
No hay lugar mejor, que ha tus pies Señor
D                               A
En ti encuentro paz, encuentro amor.

       Bm       G     D            A
Recibe mi corazón, Jesús mi buen pastor
       Bm     G         D            A
Recibe mi oración, te entrego hoy mi corazón.

D                         G9
En la intimidad de tu presencia.`,
        },
        "613c854ef601f09e344f43bf": {
            // songTitleId: "613c854ef601f09e344f43bf",
            lyric: "DO                          FA\nQue todos se postren ante Dios nuestro Señor,\nSOL                      DO  SOL\nque todas las almas lo adoren\nEn la Eucaristía, fuente viva de amor,\nPan de vida nueva que desciende por vos.\n\nLAm                        MIm\nRey de reyes, creador del hombre,\n     FA       REm        SOL    \ntodopoderoso en tu majestad.\nMI7                             LAm\nSanto Cristo que entregaste al mundo\n                 FA                     SOL\ntodo tu amor profundo para darnos tu vida.\n\n  DO  FA    SOL DO   \nGloria,   gloria.\nSOL        DO  FA    SOL  DO\n A El la Gloria,   gloria.\n\nLuz que alumbra siempre donde hay oscuridad,\nBuen pastor que a todos nos socorre.\nCordero inmolado que se ofrece en el altar\nPara darle vida nueva al hombre.\n\nRey de reyes, creador del hombre,\nTodo poderoso en su majestad.\nSanto Cristo que entregaste al mundo\nTodo tu amor profundo para darnos tu vida\n\nGloria, gloria.\nA El la Gloria, gloria",
        },
        "613c8597f601f09e344f43c2": {
            // songTitleId: "613c8597f601f09e344f43c2",
            lyric: "RE              \nA casa de Zacarí­as,\n   LA7           RE\nMarí­a se encaminó,\n   LA7           RE\n/camino de montañas\n              SOL             RE\ny en sus entrañas el mismo Dios./ (bis)\n \nRE\nLlena de gracia has venido a mí­,\n                  LA\nla mamacita del Salvador.\n/Dichosa sea la que creyó\nen la promesa de su Señor./ (bis)\n \nOyó Isabel el saludo,\nsu seno se estremeció\n/y el Espíritu Santo\ncasi cantando en ella obró./ (bis)\n\nEn el Señor yo me alegro,\nMaría un canto entonó,\n/puso en mí la mirada\nsu humilde esclava de corazón./ (bis)\n\nFortaleció a los humildes,\nal poderoso lo echó,\n/por la misericordia\nque en nuestra historia El derramó./ (bis)",
        },
        "6144d3152d6d4f8085af95d9": {
            // songTitleId: "6144d3152d6d4f8085af95d9",
            lyric: `REm   LA#   FA   DO

         FA
Siendo Dios
               DO
fuiste tan humilde
                SOLm
hombre Tú te hiciste
                    DO
Traicionado y rechazado

         FA
Siendo Dios
               DO
Tomaste mi lugar
                SOLm
Cargaste en tus hombros 
                 DO
mis heridas y pecados

         SOLm        REm
Fue por mi, te entregaste
      LA#         SOLm
Para darme vida nueva 
        DO 
Y rescatarme.

                         FA
Al contemplarte en la Cruz
                       DO
Al contemplar tanto amor
                     SOLm
No puedo más que adorarte
                LA#  
Y mi vida entregarte. 
                         FA
Al contemplarte en la Cruz
                       DO
Al contemplar tanto amor
                     SOLm
No puedo más que adorarte
                LA#   DO  REm
Y mi vida entregarte, Jesús. 


Siendo Dios, tomaste mi lugar...`,
        },
        "6144d6372d6d4f8085af95ed": {
            // songTitleId: "6144d6372d6d4f8085af95ed",
            lyric: "Busca primero el Reino de Dios\ny su perfecta justicia,\ny lo demás añadido será.  \nAleluya, aleluuuuuuya.\n\nAleluya,   aleluya, aleluya\nAleluya,  aleluuuya\nAleluya,   aleluya, aleluya\nAleluya,  aleluuuya\n\nOtras antífonas:\nCanto a la vida que Cristo regaló \ncambiando su historia\ncuando en la cruz él murió por nuestro amor.\nAleluya, aleluya.\n\nCanto por Cristo que nos liberará \ncuando él venga en la gloria\ncuando la vida por él renacerá. \nAleluya, aleluya.",
        },
        '1669486125376': {
            lyric: 'Despertemos, llega Cristo, ven Señor\nAcudamos a su encuentro\nven Señor\n\nLa iglesia espera tu venida ven Señor\ny llena de alegría canta\nven Señor\n\nPalabra eterna y creadora, ven Señor\na renovar todas las cosas\nven Señor\n\nImagen de la luz eterna, ven Señor\na iluminar nuestras tinieblas\nven Señor\n\nVerdad y vida encarnada ven Señor\na responder a nuestras ansias\nven Señor\n\nPastor y rey de nuestro pueblo, ven Señor\na conducirnos a tu Reino\nven Señor'
        },
        '1669487158540': {
            lyric: 'En este mundo que Cristo nos da,\nhacemos la ofrenda del pan;\nel pan de nuestro trabajo sin fin,\ny el vino de nuestro cantar.\nTraigo ante Ti nuestra justa inquietud:\namar la justicia y la paz.\n\nSABER QUE VENDRÁS,\nSABER QUE ESTARÁS\nPARTIENDO A LOS POBRES TU PAN.\n[Bis todo]\n\nLa sed de todos los hombres sin luz,\nla pena y triste llorar.\nEl odio de los que mueren sin fe,\ncansados de tanto luchar.\nEn la patena de nuestra oblación,\nacepta la vida, Señor.'
        },
        '1669487612347': {
            lyric: 'SOL       RE    SOL\nMaría de la esperanza \n     RE    SOL       RE     SOL  RE\npreparanos para recibir a Dios. \nSOL           DO    SOL\nQue tus dos manitos buenas \n      DO     SOL             RE  SOL\nrecuesten al niño en nuestro corazón. (BIS) \n\n\nSOL           SIm   SOL          RE\nMadre de la aurora  traenos al Señor, \nSI7           MIm               LA7\nque nuestra pobreza haga de horizonte \n               RE7\ndonde salga el sol. \nSOL       SIm    SOL             RE\nMadre peregrina, virgencita de Belén, \nSOL        DO    SOL          DO   SOL\ntraenos la buena nueva virgen misionera \n       RE  SOL\nhaznos renacer. \n\n\nSOL            SIm     SOL             RE\nAlegría de los pobres, madrecita del amor, \nSI7        MIm                LA7\namor hecho niño que une en su carne \n               RE7\nal hombre con Dios. \n\nSOL               SIm    SOL              RE\nIlumina nuestra espera, que se haga realidad, \nSOL           DO     SOL            DO      SOL\nven a transformar la noche, nuestra noche oscura \n   RE      SOL\nen Nochebuena.'
        },
        '1669487992786': {
            lyric: 'DO        MIm   REm      SOL\nToda la tierra espera al Salvador,\nDO          MIm           FA     SOL\ny el surco abierto, a la obra del Señor;\n      LAm        MIm   FA  DO\nes el mundo que lucha por la libertad,\n   LAm    MIm      SOL      DO\nreclama justicia y busca la verdad.\n\nDice el Profeta al pueblo de Israel:\n"De madre virgen ya viene el Emmanuel";\nserá "Dios con nosotros", hermano será,\ncon él la esperanza al mundo volverá.\n\nCerros y valles habrá que preparar,\nnuevos caminos tenemos que trazar;\nel Señor está cerca, hay que irlo a encontrar,\ny todas las puertas abrir de par en par.\n\nEn un pesebre, Jesús apareció,\npero en el mundo es donde nace hoy;\nvive en nuestros hermanos, con ellos está,\ny vuelve de nuevo a darnos libertad.'
        }
    },
};

// export default model('Song', SongSchema);
