
export const database = {
    authorList: {
        '123455': {
          id: '123455',
          name: 'Facundo Etcheberry',
          email: '',
          photoUrl: '',
          creatorId: '111418653738749034139',
          songTitleIds: [
            '123',
            '124'
          ]
        },
        '123456': {
          id: '123456',
          name: 'Athenas',
          email: '',
          photoUrl: '',
          creatorId: '111418653738749034139',
          songTitleIds: []
        },
        '123457': {
          id: '123457',
          name: 'Maxi Larghi',
          email: '',
          photoUrl: '',
          creatorId: '111418653738749034139',
          songTitleIds: []
        }
      },
      userList: {
        '123457': {
          id: '123457',
          name: 'Alex Vinet',
          email: '',
          photoUrl: ''
        },
        '111418653738749034139': {
          id: '111418653738749034139',
          name: 'Daniel Vinet',
          email: '',
          photoUrl: ''
        }
      },
      privateRepertoryList: {
        '6144d6372d6d4f8085af95ee': {
          id: '6144d6372d6d4f8085af95ee',
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          title: 'Misa 250 Años de la Parroquia',
          annotations: '',
          members: [],
          placeTitle: 'Parroquia Ntra. Sra. del Pilar',
          placeUbication: '',
          isMass: true,
          songs: {
            entrada: [
              ''
            ],
            gloria: [
              ''
            ],
            aleluya: [
              ''
            ],
            ofrenda: [
              ''
            ],
            santo: [
              ''
            ],
            cordero: [
              ''
            ],
            comunion: [
              ''
            ],
            meditacion: [
              ''
            ],
            salida: [
              ''
            ]
          }
        },
        '6144d6373d6d4f8085af95ee': {
          id: '6144d6373d6d4f8085af95ee',
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          title: 'Misa Sábado 20hs',
          annotations: '',
          members: [],
          placeTitle: 'Parroquia Ntra. Sra. del Pilar',
          placeUbication: '',
          isMass: true,
          songs: {
            entrada: [
              ''
            ],
            gloria: [
              ''
            ],
            aleluya: [
              ''
            ],
            ofrenda: [
              ''
            ],
            santo: [
              ''
            ],
            cordero: [
              ''
            ],
            comunion: [
              ''
            ],
            meditacion: [
              ''
            ],
            salida: [
              ''
            ]
          }
        }
      },
      privateSongTitleList: {
        '6144d6372d6d4f8085af95ee': {
          id: '6144d6372d6d4f8085af95ee',
          versionGroupId: '6144d6372d6d4f8085af95ed',
          isPrivate: true,
          lyricId: '6144d6372d6d4f8085af95ee',
          lyricIsPrivate: true,
          title: 'Aleluya III',
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          hasAccess: {
            '123457': 'Alex Vinet'
          },
          labels: [
            'aleluya'
          ],
          topics: [],
          rating: [],
          level: {
            main: 3,
            voice: 3,
            guitar: 3
          },
          pulse: '4/4 por acorde'
        },
        '1669864387705': {
          id: '1669864387705',
          versionGroupId: '1669864387705',
          isPrivate: true,
          title: 'Vida en Abundancia',
          author: {
            value: '-',
            label: 'Desconocido'
          },
          creator: {
            name: 'Daniel Vinet',
            id: '111418653738749034139'
          },
          labels: [
            'padre',
            'comunion',
            'meditacion'
          ],
          annotations: '',
          pulse: '',
          tempo: '',
          level: {
            main: 1
          },
          lyricId: 1669864387702,
          lyricIsPrivate: true
        }
      },
      privateSongLyricList: {
        '6144d6372d6d4f8085af95ee': {
          lyric: 'Busca primero el Reino de Dios\ny su perfecta justicia,\ny lo demás añadido será.  \nAleluya, aleluuuuuuya.\n\nAleluya,   aleluya, aleluya\nAleluya,  aleluuuya\nAleluya,   aleluya, aleluya\nAleluya,  aleluuuya\n\nOtras antífonas:\nCanto a la vida que Cristo regaló \ncambiando su historia\ncuando en la cruz él murió por nuestro amor.\nAleluya, aleluya.\n\nCanto por Cristo que nos liberará \ncuando él venga en la gloria\ncuando la vida por él renacerá. \nAleluya, aleluya.'
        },
        '1669864387702': {
          lyric: '     G               C                D\nLos lirios del campo   y las aves del cielo\nG               C                      D\nNo se preocupan   por que están en mis manos\n  Em              C\nTené confianza en mí\n      G           D\nAcá estoy junto a vos\n\n[Verso]\n\n G             C             D\nAmá lo que sos   y tus circunstancias\n  G            C                     D\nEstoy con vos,   con tu cruz en mi espalda\n Em           C\nTodo terminará bien\n         G                D\nYo hago nuevas todas las cosas\n\n[Pré-Refrão]\n\n   Em  C            G  D\nYo vengo a traerte vida\n            Em  C\nVida en abundancia\n       D\nEn abundancia\n\n[Refrão]\n\n          Em  C\nYo soy el camino\n               G  D\nLa verdad y la vida\n            Em  C\nVida en abundancia\n       D\nEn abundancia\n\n( G  C  D  D )\n( G  C  D  D )\n( Em  C  D  D )\n\n[Verso]\n\n    G             C                D\nNo hice al hombre   para que esté solo\n  G            C         D\nCaminen juntos   como hermanos\n   Em            C\nSopórtense mutuamente\n    G         D\nÁmense unos a otros\n\n    G        C              D\nLa felicidad   de la vida eterna\n   G      C                 D\nEmpie..za   conmigo en la tierra\n   Em      C\nSenti..te vivo\n    G                   D       \nLa fiesta del reino comienza acá\n\n[Pré-Refrão]\n\n   Em  C            G  D\nYo vengo a traerte vida\n            Em  C\nVida en abundancia\n       D\nEn abundancia\n\n[Refrão]\n\n          Em  C\nYo soy el camino\n               G  D\nLa verdad y la vida\n            Em  C\nVida en abundancia\n       D\nEn abundancia\n\n[Pré-Refrão]\n\n   Em  C            G  D\nYo vengo a traerte vida\n            Em  C\nVida en abundancia\n       D\nEn abundancia\n\n[Refrão]\n\n          Em  C\nYo soy el camino\n               G  D\nLa verdad y la vida\n            Em  C\nVida en abundancia\n       D\nEn abundancia'
        }
      },
      publicRepertoryList: {},
      publicSongTitleList: {
        '123': {
          id: '123',
          versionGroupId: '123',
          isPrivate: false,
          lyricId: '123',
          lyricIsPrivate: false,
          title: 'Espíritu de Verdad',
          author: {
            id: '123455',
            name: 'Facundo Etcheberry'
          },
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          labels: [],
          topics: [],
          rating: [],
          level: {
            main: 1
          }
        },
        '124': {
          id: '124',
          versionGroupId: '124',
          isPrivate: false,
          lyricId: '124',
          lyricIsPrivate: false,
          title: 'Todo Poder y Gloria',
          author: {
            id: '123455',
            name: 'Facundo Etcheberry'
          },
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          labels: [],
          topics: [],
          rating: [],
          level: {
            main: 1
          }
        },
        '125': {
          id: '125',
          versionGroupId: '125',
          isPrivate: false,
          lyricId: '125',
          lyricIsPrivate: false,
          title: 'Recibe mi corazón',
          author: {
            id: '123454',
            name: 'Verónica Sanfilipo'
          },
          creator: {
            id: '0',
            name: ''
          },
          labels: [],
          topics: [],
          rating: [],
          level: {
            main: 1
          }
        },
        '613c854ef601f09e344f43bf': {
          id: '613c854ef601f09e344f43bf',
          versionGroupId: '613c854ef601f09e344f43bf',
          isPrivate: false,
          lyricId: '613c854ef601f09e344f43bf',
          lyricIsPrivate: false,
          title: 'A Él la gloria',
          author: {
            id: '123453',
            name: 'Efatá'
          },
          creator: {
            id: '0',
            name: ''
          },
          labels: [
            'jesus'
          ],
          topics: [],
          rating: [],
          level: {
            main: 1
          }
        },
        '613c8597f601f09e344f43c2': {
          id: '613c8597f601f09e344f43c2',
          versionGroupId: '613c8597f601f09e344f43c2',
          isPrivate: false,
          lyricId: '613c8597f601f09e344f43c2',
          lyricIsPrivate: false,
          title: 'A casa de Zacarí\u00adas',
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          topics: [],
          labels: [],
          rating: [],
          level: {
            main: 1
          }
        },
        '6144d3152d6d4f8085af95d9': {
          id: '6144d3152d6d4f8085af95d9',
          versionGroupId: '6144d3152d6d4f8085af95d9',
          isPrivate: false,
          lyricId: '6144d3152d6d4f8085af95d9',
          lyricIsPrivate: false,
          title: 'Al contemplarte en la Cruz',
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          topics: [],
          labels: [],
          rating: [],
          level: {
            main: 1
          }
        },
        '6144d6372d6d4f8085af95ed': {
          id: '6144d6372d6d4f8085af95ed',
          versionGroupId: '6144d6372d6d4f8085af95ed',
          isPrivate: false,
          lyricId: '6144d6372d6d4f8085af95ed',
          lyricIsPrivate: false,
          title: 'Aleluya II (Busca primero el Reino de Dios)',
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          topics: [],
          labels: [
            'aleluya'
          ],
          rating: [],
          level: {
            main: 1
          }
        },
        '1669486125378': {
          id: '1669486125378',
          versionGroupId: '1669486125378',
          isPrivate: false,
          lyricId: '1669486125376',
          lyricIsPrivate: false,
          title: 'Despertemos llega Cristo',
          author: '',
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          labels: [
            'adviento',
            'navidad'
          ],
          pulse: '',
          tempo: '',
          level: {
            main: 1
          }
        },
        '1669487158543': {
          id: '1669487158543',
          versionGroupId: '1669487158543',
          isPrivate: false,
          lyricId: '1669487158540',
          lyricIsPrivate: false,
          title: 'Saber que vendrás',
          author: '',
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          labels: [
            'ofrenda'
          ],
          pulse: '',
          tempo: '',
          level: {
            main: 1
          }
        },
        '1669487612348': {
          id: '1669487612348',
          versionGroupId: '1669487612348',
          isPrivate: false,
          lyricId: '1669487612347',
          lyricIsPrivate: false,
          title: 'María de la Esperanza',
          author: '',
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          labels: [
            'comunion'
          ],
          pulse: '',
          tempo: '',
          level: {
            main: 1
          }
        },
        '1669487992788': {
          id: '1669487992788',
          versionGroupId: '1669487992788',
          isPrivate: false,
          lyricId: '1669487992786',
          lyricIsPrivate: false,
          title: 'Toda la tierra',
          author: '',
          creator: {
            id: '111418653738749034139',
            name: 'Daniel Vinet'
          },
          labels: [
            'meditacion'
          ],
          pulse: '',
          tempo: '',
          level: {
            main: 1
          }
        }
      },
      publicSongLyricList: {
        '123': {
          lyric: 'D                                      Em7\nEn tormentas, en mi oscuridad\n             G                     D\nInfunde tu luz, trae la calma\nD                                      Em7\nPurifícame y lávame de aquello\n               G                   D\nque me aleja de ti\n\nG     A           Bm7\nVen Santo Espíritu\nEm              A\nVen con tu unción\n\n[Estribillo]\nD                             Em7\nEspíritu de verdad, Espíritu de vida\nG                        D\nConsolador ven a mi vida   x2\n\n          Em7                            A\nVen Espíritu de amor, sopla en mi corazón\nBm7  A               G              D\n                Ven Espíritu de amor\n\nD                                           Em7\nHazme mirar con tus ojos Señor\n               G                     D\nTambién amar como tú amas\nD                                             Bm7\nQuiero agradarte en todo lo que yo haga\n               Em7                     A\nQuiero anunciar como me amas\n\n          G       A          Bm7\nY por eso recurro a ti,\nC                         A\nya que de mi no salen las palabras\n\nEstribillo --\nEm7               A\nVen Espíritu de amor\n\n   E                              F#m7\nEspíritu de Verdad, Espíritu de vida\nA                                E\nConsolador ven a mí vida  x4\n\n           A           \nVen Espíritu de amor, \n          Am               E9\nsopla en mi corazón'
        },
        '124': {
          lyric: '           E                B\nTu presencia es real\n         F#m             A\ntodo Dios en el altar\n               A            E\nSeas bendito y alabado\n   F#m               B\nJesús sacramentado\n\nRey eterno presente estás\npor amor a la humanidad\nSeas por siempre alabado\nmi Dios sacramentado\n\n                 C#m  G#m\nTodo el poder y gloria\n       A                     Am\npor siempre sea a ti.\n               F#m       E\nSeas bendito y alabado\n   F#m               B\nJesús sacramentado'
        },
        '125': {
          lyric: 'D              G\nEn la intimidad de tu presencia\n     D                      G\nTe rindo hoy mi ser y mi corazón\n       Bm      A        G9            D\nNo hay lugar mejor, que ha tus pies Señor\nD                               A\nEn ti encuentro paz, encuentro amor.\n\n       Bm       G     D            A\nRecibe mi corazón, Jesús mi buen pastor\n       Bm     G         D            A\nRecibe mi oración, te entrego hoy mi corazón.\n\nD                         G9\nEn la intimidad de tu presencia.'
        },
        '613c854ef601f09e344f43bf': {
          lyric: 'DO                          FA\nQue todos se postren ante Dios nuestro Señor,\nSOL                      DO  SOL\nque todas las almas lo adoren\nEn la Eucaristía, fuente viva de amor,\nPan de vida nueva que desciende por vos.\n\nLAm                        MIm\nRey de reyes, creador del hombre,\n     FA       REm        SOL    \ntodopoderoso en tu majestad.\nMI7                             LAm\nSanto Cristo que entregaste al mundo\n                 FA                     SOL\ntodo tu amor profundo para darnos tu vida.\n\n  DO  FA    SOL DO   \nGloria,   gloria.\nSOL        DO  FA    SOL  DO\n A El la Gloria,   gloria.\n\nLuz que alumbra siempre donde hay oscuridad,\nBuen pastor que a todos nos socorre.\nCordero inmolado que se ofrece en el altar\nPara darle vida nueva al hombre.\n\nRey de reyes, creador del hombre,\nTodo poderoso en su majestad.\nSanto Cristo que entregaste al mundo\nTodo tu amor profundo para darnos tu vida\n\nGloria, gloria.\nA El la Gloria, gloria'
        },
        '613c8597f601f09e344f43c2': {
          lyric: 'RE              \nA casa de Zacarí\u00adas,\n   LA7           RE\nMarí\u00ada se encaminó,\n   LA7           RE\n/camino de montañas\n              SOL             RE\ny en sus entrañas el mismo Dios./ (bis)\n \nRE\nLlena de gracia has venido a mí\u00ad,\n                  LA\nla mamacita del Salvador.\n/Dichosa sea la que creyó\nen la promesa de su Señor./ (bis)\n \nOyó Isabel el saludo,\nsu seno se estremeció\n/y el Espíritu Santo\ncasi cantando en ella obró./ (bis)\n\nEn el Señor yo me alegro,\nMaría un canto entonó,\n/puso en mí la mirada\nsu humilde esclava de corazón./ (bis)\n\nFortaleció a los humildes,\nal poderoso lo echó,\n/por la misericordia\nque en nuestra historia El derramó./ (bis)'
        },
        '6144d3152d6d4f8085af95d9': {
          lyric: 'REm   LA#   FA   DO\n\n         FA\nSiendo Dios\n               DO\nfuiste tan humilde\n                SOLm\nhombre Tú te hiciste\n                    DO\nTraicionado y rechazado\n\n         FA\nSiendo Dios\n               DO\nTomaste mi lugar\n                SOLm\nCargaste en tus hombros \n                 DO\nmis heridas y pecados\n\n         SOLm        REm\nFue por mi, te entregaste\n      LA#         SOLm\nPara darme vida nueva \n        DO \nY rescatarme.\n\n                         FA\nAl contemplarte en la Cruz\n                       DO\nAl contemplar tanto amor\n                     SOLm\nNo puedo más que adorarte\n                LA#  \nY mi vida entregarte. \n                         FA\nAl contemplarte en la Cruz\n                       DO\nAl contemplar tanto amor\n                     SOLm\nNo puedo más que adorarte\n                LA#   DO  REm\nY mi vida entregarte, Jesús. \n\n\nSiendo Dios, tomaste mi lugar...'
        },
        '6144d6372d6d4f8085af95ed': {
          lyric: 'Busca primero el Reino de Dios\ny su perfecta justicia,\ny lo demás añadido será.  \nAleluya, aleluuuuuuya.\n\nAleluya,   aleluya, aleluya\nAleluya,  aleluuuya\nAleluya,   aleluya, aleluya\nAleluya,  aleluuuya\n\nOtras antífonas:\nCanto a la vida que Cristo regaló \ncambiando su historia\ncuando en la cruz él murió por nuestro amor.\nAleluya, aleluya.\n\nCanto por Cristo que nos liberará \ncuando él venga en la gloria\ncuando la vida por él renacerá. \nAleluya, aleluya.'
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
      }
  
};

// export default model('Song', SongSchema);
