export const MEAL_PLAN_TEMPLATES = [
  {
    id: 1,
    slug: "emagrecimento-1200kcal",
    name: "Emagrecimento 1200 kcal",
    objective: "emagrecimento",
    totalCalories: 1200,
    macros: { protein: 90, carbs: 150, fat: 27 },
    mealsPerDay: 5,
    restrictions: [],
    tags: ["déficit calórico", "baixo IG", "fibras"],
    badgeLabel: "Emagrecimento",
    badgeColor: "green",
    clinicalNotes: "Plano hipocalórico para emagrecimento gradual (0,5–1 kg/semana). Prioriza proteína para preservação de massa muscular.",
    contraindications: "Não indicado para gestantes, lactantes ou IMC < 18,5.",
    patientInstructions: "Beba pelo menos 2 litros de água por dia. Mastigue bem os alimentos. Evite beliscar entre as refeições.",
    meals: [
      {
        id: "1-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 280,
        observations: "Prefira frutas de baixo IG como maçã ou pera.",
        foods: [
          {
            id: "1-r1-f1",
            name: "Aveia em flocos",
            quantity: 4,
            unit: "colher de sopa",
            grams: 40,
            calories: 148,
            macros: { cho: 26, ptn: 5, lip: 3 },
            substitutions: [
              { id: "s1", name: "Granola sem açúcar", quantity: 3, unit: "colher de sopa", grams: 30, calories: 130, macros: { cho: 22, ptn: 3, lip: 4 }, note: null, restriction: null },
              { id: "s2", name: "Tapioca", quantity: 2, unit: "unidade pequena", grams: 40, calories: 136, macros: { cho: 32, ptn: 1, lip: 0 }, note: "Sem glúten", restriction: "sem_gluten" }
            ]
          },
          {
            id: "1-r1-f2",
            name: "Leite desnatado",
            quantity: 1,
            unit: "copo (200ml)",
            grams: 200,
            calories: 68,
            macros: { cho: 9, ptn: 7, lip: 0 },
            substitutions: [
              { id: "s3", name: "Leite de amêndoas sem açúcar", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 40, macros: { cho: 2, ptn: 1, lip: 3 }, note: "Sem lactose e vegano", restriction: "sem_lactose" },
              { id: "s4", name: "Iogurte natural desnatado", quantity: 1, unit: "pote (100g)", grams: 100, calories: 55, macros: { cho: 7, ptn: 6, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "1-r1-f3",
            name: "Banana-prata",
            quantity: 1,
            unit: "unidade média",
            grams: 80,
            calories: 64,
            macros: { cho: 15, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s5", name: "Maçã", quantity: 1, unit: "unidade média", grams: 130, calories: 68, macros: { cho: 17, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s6", name: "Mamão papaia", quantity: 1, unit: "fatia média", grams: 120, calories: 48, macros: { cho: 12, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "1-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 120,
        observations: "Lanche leve para evitar chegar com muita fome no almoço.",
        foods: [
          {
            id: "1-r2-f1",
            name: "Iogurte natural desnatado",
            quantity: 1,
            unit: "pote (100g)",
            grams: 100,
            calories: 55,
            macros: { cho: 7, ptn: 6, lip: 0 },
            substitutions: [
              { id: "s7", name: "Queijo cottage", quantity: 3, unit: "colher de sopa", grams: 60, calories: 54, macros: { cho: 2, ptn: 9, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "1-r2-f2",
            name: "Castanha-do-pará",
            quantity: 2,
            unit: "unidade",
            grams: 8,
            calories: 55,
            macros: { cho: 1, ptn: 1, lip: 5 },
            substitutions: [
              { id: "s8", name: "Amendoim sem sal", quantity: 1, unit: "colher de sopa", grams: 12, calories: 68, macros: { cho: 2, ptn: 3, lip: 6 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "1-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 420,
        observations: "Metade do prato deve ser vegetais. Evite frituras.",
        foods: [
          {
            id: "1-r3-f1",
            name: "Arroz integral cozido",
            quantity: 4,
            unit: "colher de sopa",
            grams: 80,
            calories: 112,
            macros: { cho: 23, ptn: 3, lip: 1 },
            substitutions: [
              { id: "s9", name: "Quinoa cozida", quantity: 3, unit: "colher de sopa", grams: 60, calories: 81, macros: { cho: 14, ptn: 4, lip: 1 }, note: "Rico em proteína completa", restriction: null },
              { id: "s10", name: "Batata-doce cozida", quantity: 2, unit: "colher de sopa", grams: 70, calories: 70, macros: { cho: 16, ptn: 1, lip: 0 }, note: "Sem glúten", restriction: "sem_gluten" }
            ]
          },
          {
            id: "1-r3-f2",
            name: "Feijão-carioca cozido",
            quantity: 2,
            unit: "concha pequena",
            grams: 60,
            calories: 72,
            macros: { cho: 13, ptn: 5, lip: 0 },
            substitutions: [
              { id: "s11", name: "Lentilha cozida", quantity: 3, unit: "colher de sopa", grams: 60, calories: 69, macros: { cho: 12, ptn: 5, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "1-r3-f3",
            name: "Peito de frango grelhado",
            quantity: 1,
            unit: "filé médio",
            grams: 120,
            calories: 156,
            macros: { cho: 0, ptn: 32, lip: 3 },
            substitutions: [
              { id: "s12", name: "Atum em água (escorrido)", quantity: 1, unit: "lata pequena", grams: 120, calories: 132, macros: { cho: 0, ptn: 28, lip: 2 }, note: null, restriction: null },
              { id: "s13", name: "Tilápia assada", quantity: 1, unit: "filé médio", grams: 120, calories: 132, macros: { cho: 0, ptn: 27, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "1-r3-f4",
            name: "Salada (alface + tomate + pepino)",
            quantity: 1,
            unit: "prato raso",
            grams: 120,
            calories: 30,
            macros: { cho: 5, ptn: 2, lip: 0 },
            substitutions: []
          },
          {
            id: "1-r3-f5",
            name: "Azeite de oliva extra virgem",
            quantity: 1,
            unit: "colher de sobremesa",
            grams: 7,
            calories: 62,
            macros: { cho: 0, ptn: 0, lip: 7 },
            substitutions: []
          }
        ]
      },
      {
        id: "1-ref4",
        name: "Lanche da tarde",
        time: "15:30",
        calories: 130,
        observations: "Se tiver fome antes, prefira vegetais crus como cenoura.",
        foods: [
          {
            id: "1-r4-f1",
            name: "Maçã",
            quantity: 1,
            unit: "unidade média",
            grams: 130,
            calories: 68,
            macros: { cho: 17, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s14", name: "Pera", quantity: 1, unit: "unidade média", grams: 130, calories: 65, macros: { cho: 16, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "1-r4-f2",
            name: "Whey protein (sem açúcar)",
            quantity: 1,
            unit: "scoop (25g)",
            grams: 25,
            calories: 92,
            macros: { cho: 2, ptn: 20, lip: 1 },
            substitutions: [
              { id: "s15", name: "Ovo cozido", quantity: 2, unit: "unidade", grams: 100, calories: 144, macros: { cho: 1, ptn: 13, lip: 10 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "1-ref5",
        name: "Jantar",
        time: "19:00",
        calories: 250,
        observations: "Refeição mais leve. Evite carboidratos simples à noite.",
        foods: [
          {
            id: "1-r5-f1",
            name: "Omelete de 3 ovos",
            quantity: 1,
            unit: "unidade",
            grams: 150,
            calories: 216,
            macros: { cho: 1, ptn: 19, lip: 15 },
            substitutions: [
              { id: "s16", name: "Peito de peru grelhado", quantity: 3, unit: "fatia", grams: 90, calories: 108, macros: { cho: 0, ptn: 20, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "1-r5-f2",
            name: "Couve-flor cozida",
            quantity: 3,
            unit: "ramos grandes",
            grams: 100,
            calories: 25,
            macros: { cho: 4, ptn: 2, lip: 0 },
            substitutions: [
              { id: "s17", name: "Brócolis cozido", quantity: 3, unit: "ramos grandes", grams: 100, calories: 34, macros: { cho: 5, ptn: 3, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },

  {
    id: 2,
    slug: "hipertrofia-2800kcal",
    name: "Hipertrofia 2800 kcal",
    objective: "hipertrofia",
    totalCalories: 2800,
    macros: { protein: 175, carbs: 350, fat: 78 },
    mealsPerDay: 6,
    restrictions: [],
    tags: ["hipercalórico", "alto carbo", "ganho de massa"],
    badgeLabel: "Hipertrofia",
    badgeColor: "blue",
    clinicalNotes: "Plano hipercalórico para ganho de massa muscular. Distribuição proteica ao longo do dia para otimizar síntese muscular.",
    contraindications: "Monitorar perfil lipídico. Não indicado para pacientes com insuficiência renal.",
    patientInstructions: "Consuma carboidratos pré e pós-treino. Mantenha hidratação adequada (35ml/kg/dia).",
    meals: [
      {
        id: "2-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 600,
        observations: "Refeição densa em nutrientes para começar o dia com energia.",
        foods: [
          {
            id: "2-r1-f1",
            name: "Aveia em flocos",
            quantity: 6,
            unit: "colher de sopa",
            grams: 60,
            calories: 222,
            macros: { cho: 39, ptn: 8, lip: 4 },
            substitutions: [
              { id: "s18", name: "Cuscuz de milho cozido", quantity: 4, unit: "colher de sopa", grams: 80, calories: 224, macros: { cho: 46, ptn: 4, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "2-r1-f2",
            name: "Ovos mexidos (3 ovos)",
            quantity: 3,
            unit: "unidade",
            grams: 150,
            calories: 216,
            macros: { cho: 1, ptn: 19, lip: 15 },
            substitutions: []
          },
          {
            id: "2-r1-f3",
            name: "Leite integral",
            quantity: 1,
            unit: "copo (200ml)",
            grams: 200,
            calories: 122,
            macros: { cho: 10, ptn: 6, lip: 7 },
            substitutions: [
              { id: "s19", name: "Leite de aveia", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 100, macros: { cho: 16, ptn: 3, lip: 2 }, note: "Sem lactose", restriction: "sem_lactose" }
            ]
          },
          {
            id: "2-r1-f4",
            name: "Banana-prata",
            quantity: 2,
            unit: "unidade média",
            grams: 160,
            calories: 128,
            macros: { cho: 30, ptn: 2, lip: 0 },
            substitutions: []
          }
        ]
      },
      {
        id: "2-ref2",
        name: "Lanche pré-treino",
        time: "10:00",
        calories: 350,
        observations: "Consumir 60 minutos antes do treino.",
        foods: [
          {
            id: "2-r2-f1",
            name: "Pão integral",
            quantity: 2,
            unit: "fatia",
            grams: 60,
            calories: 156,
            macros: { cho: 28, ptn: 6, lip: 2 },
            substitutions: [
              { id: "s20", name: "Batata-doce cozida", quantity: 1, unit: "unidade média", grams: 150, calories: 150, macros: { cho: 35, ptn: 2, lip: 0 }, note: "Sem glúten", restriction: "sem_gluten" }
            ]
          },
          {
            id: "2-r2-f2",
            name: "Pasta de amendoim integral",
            quantity: 2,
            unit: "colher de sopa",
            grams: 32,
            calories: 192,
            macros: { cho: 6, ptn: 8, lip: 16 },
            substitutions: []
          }
        ]
      },
      {
        id: "2-ref3",
        name: "Almoço",
        time: "13:00",
        calories: 700,
        observations: "Maior refeição do dia. Priorize proteína magra e carboidratos complexos.",
        foods: [
          {
            id: "2-r3-f1",
            name: "Arroz branco cozido",
            quantity: 8,
            unit: "colher de sopa",
            grams: 160,
            calories: 218,
            macros: { cho: 48, ptn: 4, lip: 0 },
            substitutions: [
              { id: "s21", name: "Macarrão integral cozido", quantity: 2, unit: "xícara", grams: 160, calories: 224, macros: { cho: 44, ptn: 8, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "2-r3-f2",
            name: "Feijão-carioca cozido",
            quantity: 3,
            unit: "concha pequena",
            grams: 90,
            calories: 108,
            macros: { cho: 19, ptn: 7, lip: 1 },
            substitutions: []
          },
          {
            id: "2-r3-f3",
            name: "Coxão mole grelhado",
            quantity: 1,
            unit: "filé grande",
            grams: 180,
            calories: 270,
            macros: { cho: 0, ptn: 45, lip: 9 },
            substitutions: [
              { id: "s22", name: "Peito de frango grelhado", quantity: 2, unit: "filé médio", grams: 240, calories: 312, macros: { cho: 0, ptn: 64, lip: 6 }, note: null, restriction: null }
            ]
          },
          {
            id: "2-r3-f4",
            name: "Salada variada",
            quantity: 1,
            unit: "prato raso",
            grams: 150,
            calories: 40,
            macros: { cho: 7, ptn: 2, lip: 0 },
            substitutions: []
          },
          {
            id: "2-r3-f5",
            name: "Azeite de oliva",
            quantity: 1,
            unit: "colher de sopa",
            grams: 13,
            calories: 115,
            macros: { cho: 0, ptn: 0, lip: 13 },
            substitutions: []
          }
        ]
      },
      {
        id: "2-ref4",
        name: "Lanche pós-treino",
        time: "17:00",
        calories: 400,
        observations: "Consumir imediatamente após o treino para melhor recuperação.",
        foods: [
          {
            id: "2-r4-f1",
            name: "Whey protein",
            quantity: 2,
            unit: "scoop (25g)",
            grams: 50,
            calories: 184,
            macros: { cho: 4, ptn: 40, lip: 2 },
            substitutions: [
              { id: "s23", name: "Ovos cozidos", quantity: 4, unit: "unidade", grams: 200, calories: 288, macros: { cho: 1, ptn: 26, lip: 20 }, note: null, restriction: null }
            ]
          },
          {
            id: "2-r4-f2",
            name: "Banana-prata",
            quantity: 2,
            unit: "unidade",
            grams: 160,
            calories: 128,
            macros: { cho: 30, ptn: 2, lip: 0 },
            substitutions: []
          },
          {
            id: "2-r4-f3",
            name: "Mel",
            quantity: 1,
            unit: "colher de chá",
            grams: 7,
            calories: 21,
            macros: { cho: 6, ptn: 0, lip: 0 },
            substitutions: []
          }
        ]
      },
      {
        id: "2-ref5",
        name: "Jantar",
        time: "20:00",
        calories: 550,
        observations: "Refeição rica em proteína para recuperação noturna.",
        foods: [
          {
            id: "2-r5-f1",
            name: "Batata-doce cozida",
            quantity: 2,
            unit: "unidade média",
            grams: 300,
            calories: 300,
            macros: { cho: 70, ptn: 4, lip: 0 },
            substitutions: []
          },
          {
            id: "2-r5-f2",
            name: "Salmão grelhado",
            quantity: 1,
            unit: "filé médio",
            grams: 150,
            calories: 250,
            macros: { cho: 0, ptn: 34, lip: 12 },
            substitutions: [
              { id: "s24", name: "Frango assado", quantity: 1, unit: "filé grande", grams: 150, calories: 195, macros: { cho: 0, ptn: 40, lip: 4 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "2-ref6",
        name: "Ceia",
        time: "22:30",
        calories: 200,
        observations: "Proteína de digestão lenta para anabolismo noturno.",
        foods: [
          {
            id: "2-r6-f1",
            name: "Queijo cottage",
            quantity: 5,
            unit: "colher de sopa",
            grams: 100,
            calories: 90,
            macros: { cho: 3, ptn: 14, lip: 2 },
            substitutions: []
          },
          {
            id: "2-r6-f2",
            name: "Castanha-do-pará",
            quantity: 4,
            unit: "unidade",
            grams: 16,
            calories: 110,
            macros: { cho: 2, ptn: 2, lip: 11 },
            substitutions: []
          }
        ]
      }
    ]
  },

  {
    id: 3,
    slug: "sem-lactose-1800kcal",
    name: "Sem Lactose 1800 kcal",
    objective: "manutencao",
    totalCalories: 1800,
    macros: { protein: 90, carbs: 248, fat: 50 },
    mealsPerDay: 5,
    restrictions: ["sem_lactose"],
    tags: ["sem lactose", "intolerância", "substitutos vegetais"],
    badgeLabel: "Sem Lactose",
    badgeColor: "yellow",
    clinicalNotes: "Indicado para intolerância à lactose ou alergia à proteína do leite. Garanta aporte adequado de cálcio por fontes vegetais.",
    contraindications: "Verificar outros componentes dos alimentos industrializados (rótulos).",
    patientInstructions: "Leia sempre os rótulos dos alimentos. Leite de vaca e derivados devem ser completamente evitados.",
    meals: [
      {
        id: "3-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 380,
        observations: "Use leites vegetais enriquecidos com cálcio.",
        foods: [
          {
            id: "3-r1-f1",
            name: "Leite de amêndoas sem açúcar",
            quantity: 1,
            unit: "copo (250ml)",
            grams: 250,
            calories: 50,
            macros: { cho: 2, ptn: 1, lip: 4 },
            substitutions: [
              { id: "s25", name: "Leite de aveia", quantity: 1, unit: "copo (250ml)", grams: 250, calories: 125, macros: { cho: 20, ptn: 4, lip: 3 }, note: null, restriction: "sem_lactose" },
              { id: "s26", name: "Leite de coco light", quantity: 1, unit: "copo (250ml)", grams: 250, calories: 90, macros: { cho: 4, ptn: 1, lip: 8 }, note: null, restriction: "sem_lactose" }
            ]
          },
          {
            id: "3-r1-f2",
            name: "Pão integral",
            quantity: 2,
            unit: "fatia",
            grams: 60,
            calories: 156,
            macros: { cho: 28, ptn: 6, lip: 2 },
            substitutions: []
          },
          {
            id: "3-r1-f3",
            name: "Abacate",
            quantity: 2,
            unit: "colher de sopa",
            grams: 40,
            calories: 72,
            macros: { cho: 2, ptn: 1, lip: 7 },
            substitutions: []
          },
          {
            id: "3-r1-f4",
            name: "Mamão papaia",
            quantity: 1,
            unit: "fatia média",
            grams: 150,
            calories: 60,
            macros: { cho: 15, ptn: 1, lip: 0 },
            substitutions: []
          }
        ]
      },
      {
        id: "3-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 180,
        observations: null,
        foods: [
          {
            id: "3-r2-f1",
            name: "Banana-prata",
            quantity: 1,
            unit: "unidade grande",
            grams: 100,
            calories: 80,
            macros: { cho: 19, ptn: 1, lip: 0 },
            substitutions: []
          },
          {
            id: "3-r2-f2",
            name: "Mix de castanhas sem sal",
            quantity: 1,
            unit: "punhado (20g)",
            grams: 20,
            calories: 120,
            macros: { cho: 4, ptn: 3, lip: 10 },
            substitutions: []
          }
        ]
      },
      {
        id: "3-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 520,
        observations: "Inclua brócolis e couve como fontes de cálcio.",
        foods: [
          {
            id: "3-r3-f1",
            name: "Arroz integral cozido",
            quantity: 6,
            unit: "colher de sopa",
            grams: 120,
            calories: 168,
            macros: { cho: 35, ptn: 4, lip: 1 },
            substitutions: []
          },
          {
            id: "3-r3-f2",
            name: "Feijão-preto cozido",
            quantity: 2,
            unit: "concha",
            grams: 100,
            calories: 130,
            macros: { cho: 23, ptn: 9, lip: 1 },
            substitutions: []
          },
          {
            id: "3-r3-f3",
            name: "Peito de frango grelhado",
            quantity: 1,
            unit: "filé médio",
            grams: 120,
            calories: 156,
            macros: { cho: 0, ptn: 32, lip: 3 },
            substitutions: [
              { id: "s27", name: "Peixe branco grelhado", quantity: 1, unit: "filé médio", grams: 120, calories: 132, macros: { cho: 0, ptn: 27, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "3-r3-f4",
            name: "Couve refogada",
            quantity: 2,
            unit: "colher de sopa",
            grams: 40,
            calories: 36,
            macros: { cho: 4, ptn: 2, lip: 2 },
            substitutions: []
          }
        ]
      },
      {
        id: "3-ref4",
        name: "Lanche da tarde",
        time: "16:00",
        calories: 230,
        observations: null,
        foods: [
          {
            id: "3-r4-f1",
            name: "Vitamina de banana com leite de aveia",
            quantity: 1,
            unit: "copo (300ml)",
            grams: 300,
            calories: 180,
            macros: { cho: 38, ptn: 4, lip: 3 },
            substitutions: []
          },
          {
            id: "3-r4-f2",
            name: "Amendoim torrado sem sal",
            quantity: 1,
            unit: "colher de sopa",
            grams: 15,
            calories: 90,
            macros: { cho: 3, ptn: 4, lip: 7 },
            substitutions: []
          }
        ]
      },
      {
        id: "3-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 490,
        observations: "Refeição sem nenhum produto lácteo.",
        foods: [
          {
            id: "3-r5-f1",
            name: "Macarrão integral cozido",
            quantity: 2,
            unit: "xícara cheia",
            grams: 200,
            calories: 280,
            macros: { cho: 55, ptn: 10, lip: 2 },
            substitutions: []
          },
          {
            id: "3-r5-f2",
            name: "Molho de tomate caseiro",
            quantity: 3,
            unit: "colher de sopa",
            grams: 60,
            calories: 36,
            macros: { cho: 7, ptn: 1, lip: 1 },
            substitutions: []
          },
          {
            id: "3-r5-f3",
            name: "Patinho moído grelhado",
            quantity: 1,
            unit: "porção média",
            grams: 100,
            calories: 162,
            macros: { cho: 0, ptn: 26, lip: 6 },
            substitutions: []
          }
        ]
      }
    ]
  },

  {
    id: 4,
    slug: "sem-gluten-1800kcal",
    name: "Sem Glúten 1800 kcal",
    objective: "manutencao",
    totalCalories: 1800,
    macros: { protein: 90, carbs: 248, fat: 50 },
    mealsPerDay: 5,
    restrictions: ["sem_gluten"],
    tags: ["sem glúten", "doença celíaca", "intolerância"],
    badgeLabel: "Sem Glúten",
    badgeColor: "orange",
    clinicalNotes: "Indicado para doença celíaca ou sensibilidade ao glúten. Atenção à contaminação cruzada.",
    contraindications: "Verificar todos os rótulos, incluindo temperos e molhos industrializados.",
    patientInstructions: "Evite trigo, centeio, cevada e aveia convencional. Prefira produtos certificados sem glúten.",
    meals: [
      {
        id: "4-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 360,
        observations: "Use aveia certificada sem glúten ou substitua por farinha de arroz.",
        foods: [
          {
            id: "4-r1-f1",
            name: "Tapioca (2 unidades)",
            quantity: 2,
            unit: "unidade média",
            grams: 80,
            calories: 272,
            macros: { cho: 64, ptn: 2, lip: 0 },
            substitutions: [
              { id: "s28", name: "Pão de queijo assado", quantity: 3, unit: "unidade média", grams: 90, calories: 280, macros: { cho: 30, ptn: 8, lip: 14 }, note: null, restriction: "sem_gluten" }
            ]
          },
          {
            id: "4-r1-f2",
            name: "Recheio: frango desfiado + orégano",
            quantity: 3,
            unit: "colher de sopa",
            grams: 60,
            calories: 78,
            macros: { cho: 0, ptn: 16, lip: 1 },
            substitutions: []
          }
        ]
      },
      {
        id: "4-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 200,
        observations: null,
        foods: [
          {
            id: "4-r2-f1",
            name: "Iogurte natural integral",
            quantity: 1,
            unit: "pote (170g)",
            grams: 170,
            calories: 110,
            macros: { cho: 8, ptn: 7, lip: 5 },
            substitutions: []
          },
          {
            id: "4-r2-f2",
            name: "Mel",
            quantity: 1,
            unit: "colher de chá",
            grams: 7,
            calories: 21,
            macros: { cho: 6, ptn: 0, lip: 0 },
            substitutions: []
          },
          {
            id: "4-r2-f3",
            name: "Castanha-de-caju",
            quantity: 6,
            unit: "unidade",
            grams: 18,
            calories: 99,
            macros: { cho: 5, ptn: 3, lip: 8 },
            substitutions: []
          }
        ]
      },
      {
        id: "4-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 520,
        observations: "Todos os ingredientes devem ser naturalmente isentos de glúten.",
        foods: [
          {
            id: "4-r3-f1",
            name: "Arroz branco cozido",
            quantity: 6,
            unit: "colher de sopa",
            grams: 120,
            calories: 163,
            macros: { cho: 36, ptn: 3, lip: 0 },
            substitutions: [
              { id: "s29", name: "Quinoa cozida", quantity: 5, unit: "colher de sopa", grams: 100, calories: 135, macros: { cho: 23, ptn: 6, lip: 2 }, note: null, restriction: "sem_gluten" }
            ]
          },
          {
            id: "4-r3-f2",
            name: "Feijão-carioca cozido",
            quantity: 2,
            unit: "concha",
            grams: 100,
            calories: 120,
            macros: { cho: 22, ptn: 8, lip: 1 },
            substitutions: []
          },
          {
            id: "4-r3-f3",
            name: "Carne bovina magra grelhada",
            quantity: 1,
            unit: "medalhão",
            grams: 120,
            calories: 180,
            macros: { cho: 0, ptn: 30, lip: 6 },
            substitutions: []
          },
          {
            id: "4-r3-f4",
            name: "Salada (folhas + tomate)",
            quantity: 1,
            unit: "prato raso",
            grams: 120,
            calories: 30,
            macros: { cho: 5, ptn: 2, lip: 0 },
            substitutions: []
          }
        ]
      },
      {
        id: "4-ref4",
        name: "Lanche da tarde",
        time: "16:00",
        calories: 220,
        observations: null,
        foods: [
          {
            id: "4-r4-f1",
            name: "Batata-doce cozida",
            quantity: 1,
            unit: "unidade média",
            grams: 150,
            calories: 150,
            macros: { cho: 35, ptn: 2, lip: 0 },
            substitutions: []
          },
          {
            id: "4-r4-f2",
            name: "Ovos cozidos",
            quantity: 2,
            unit: "unidade",
            grams: 100,
            calories: 144,
            macros: { cho: 1, ptn: 13, lip: 10 },
            substitutions: []
          }
        ]
      },
      {
        id: "4-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 500,
        observations: "Use polvilho doce ou farinha de arroz no preparo.",
        foods: [
          {
            id: "4-r5-f1",
            name: "Macarrão de arroz cozido",
            quantity: 2,
            unit: "xícara",
            grams: 200,
            calories: 280,
            macros: { cho: 62, ptn: 4, lip: 0 },
            substitutions: [
              { id: "s30", name: "Batata cozida", quantity: 2, unit: "unidade média", grams: 200, calories: 154, macros: { cho: 35, ptn: 4, lip: 0 }, note: null, restriction: "sem_gluten" }
            ]
          },
          {
            id: "4-r5-f2",
            name: "Frango assado com ervas",
            quantity: 1,
            unit: "filé grande",
            grams: 150,
            calories: 195,
            macros: { cho: 0, ptn: 40, lip: 4 },
            substitutions: []
          }
        ]
      }
    ]
  },

  {
    id: 5,
    slug: "cetogenico-1600kcal",
    name: "Cetogênico 1600 kcal",
    objective: "emagrecimento",
    totalCalories: 1600,
    macros: { protein: 80, carbs: 20, fat: 133 },
    mealsPerDay: 3,
    restrictions: [],
    tags: ["cetogênico", "baixo carbo", "gordura saudável"],
    badgeLabel: "Cetogênico",
    badgeColor: "purple",
    clinicalNotes: "Plano cetogênico clássico (75% gordura). Induz cetose metabólica em 2–7 dias. Monitorar eletrólitos.",
    contraindications: "Contraindicado em doenças hepáticas, renais, pancreatite, gravidez e transtornos alimentares.",
    patientInstructions: "Pode sentir 'gripe cetogênica' nos primeiros dias (fadiga, dor de cabeça). Hidratação redobrada e sódio adequado.",
    meals: [
      {
        id: "5-ref1",
        name: "Café da manhã",
        time: "08:00",
        calories: 530,
        observations: "Sem nenhum carboidrato. Priorize gorduras boas.",
        foods: [
          {
            id: "5-r1-f1",
            name: "Ovos mexidos na manteiga (3 ovos)",
            quantity: 3,
            unit: "unidade",
            grams: 150,
            calories: 270,
            macros: { cho: 1, ptn: 19, lip: 21 },
            substitutions: []
          },
          {
            id: "5-r1-f2",
            name: "Bacon",
            quantity: 3,
            unit: "fatia",
            grams: 30,
            calories: 150,
            macros: { cho: 0, ptn: 5, lip: 14 },
            substitutions: []
          },
          {
            id: "5-r1-f3",
            name: "Abacate",
            quantity: 1,
            unit: "metade pequena",
            grams: 80,
            calories: 144,
            macros: { cho: 2, ptn: 1, lip: 14 },
            substitutions: []
          },
          {
            id: "5-r1-f4",
            name: "Café com manteiga (Bulletproof)",
            quantity: 1,
            unit: "xícara (240ml)",
            grams: 240,
            calories: 92,
            macros: { cho: 0, ptn: 0, lip: 10 },
            substitutions: []
          }
        ]
      },
      {
        id: "5-ref2",
        name: "Almoço",
        time: "13:00",
        calories: 600,
        observations: "Verduras não amiláceas à vontade.",
        foods: [
          {
            id: "5-r2-f1",
            name: "Salmão grelhado",
            quantity: 1,
            unit: "filé grande",
            grams: 180,
            calories: 300,
            macros: { cho: 0, ptn: 41, lip: 14 },
            substitutions: [
              { id: "s31", name: "Atum fresco grelhado", quantity: 1, unit: "filé grande", grams: 180, calories: 252, macros: { cho: 0, ptn: 42, lip: 8 }, note: null, restriction: null }
            ]
          },
          {
            id: "5-r2-f2",
            name: "Espinafre refogado em azeite",
            quantity: 3,
            unit: "colher de sopa",
            grams: 80,
            calories: 100,
            macros: { cho: 2, ptn: 3, lip: 9 },
            substitutions: []
          },
          {
            id: "5-r2-f3",
            name: "Queijo parmesão",
            quantity: 2,
            unit: "colher de sopa",
            grams: 20,
            calories: 86,
            macros: { cho: 1, ptn: 8, lip: 6 },
            substitutions: []
          },
          {
            id: "5-r2-f4",
            name: "Azeite extra virgem",
            quantity: 2,
            unit: "colher de sopa",
            grams: 26,
            calories: 230,
            macros: { cho: 0, ptn: 0, lip: 26 },
            substitutions: []
          }
        ]
      },
      {
        id: "5-ref3",
        name: "Jantar",
        time: "19:00",
        calories: 470,
        observations: "Última refeição do dia. Sem frutas.",
        foods: [
          {
            id: "5-r3-f1",
            name: "Costela bovina assada",
            quantity: 1,
            unit: "porção (150g)",
            grams: 150,
            calories: 320,
            macros: { cho: 0, ptn: 30, lip: 22 },
            substitutions: []
          },
          {
            id: "5-r3-f2",
            name: "Couve-flor grelhada",
            quantity: 1,
            unit: "xícara",
            grams: 100,
            calories: 30,
            macros: { cho: 5, ptn: 2, lip: 0 },
            substitutions: []
          },
          {
            id: "5-r3-f3",
            name: "Cream cheese",
            quantity: 2,
            unit: "colher de sopa",
            grams: 30,
            calories: 99,
            macros: { cho: 1, ptn: 2, lip: 10 },
            substitutions: []
          }
        ]
      }
    ]
  },

  {
    id: 6,
    slug: "baixo-fibras-1800kcal",
    name: "Baixo Teor de Fibras 1800 kcal",
    objective: "manutencao",
    totalCalories: 1800,
    macros: { protein: 90, carbs: 270, fat: 40 },
    mealsPerDay: 5,
    restrictions: [],
    tags: ["baixo fibras", "colite", "pós-cirurgia", "intestino"],
    badgeLabel: "Baixo Fibras",
    badgeColor: "gray",
    clinicalNotes: "Indicado em doenças inflamatórias intestinais, pós-operatório digestivo ou doença de Crohn em fase aguda. Fibras totais < 10g/dia.",
    contraindications: "Não manter por períodos prolongados sem acompanhamento.",
    patientInstructions: "Prefira alimentos bem cozidos. Evite cascas, sementes, grãos integrais e vegetais crus.",
    meals: [
      {
        id: "6-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 350,
        observations: "Pão branco e frutas sem casca.",
        foods: [
          {
            id: "6-r1-f1",
            name: "Pão francês (miolo)",
            quantity: 2,
            unit: "unidade",
            grams: 100,
            calories: 270,
            macros: { cho: 53, ptn: 9, lip: 2 },
            substitutions: []
          },
          {
            id: "6-r1-f2",
            name: "Margarina light",
            quantity: 1,
            unit: "colher de chá",
            grams: 5,
            calories: 27,
            macros: { cho: 0, ptn: 0, lip: 3 },
            substitutions: []
          },
          {
            id: "6-r1-f3",
            name: "Goiaba sem semente e casca",
            quantity: 1,
            unit: "unidade média",
            grams: 80,
            calories: 42,
            macros: { cho: 10, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s32", name: "Pera sem casca", quantity: 1, unit: "unidade média", grams: 100, calories: 50, macros: { cho: 12, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "6-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 160,
        observations: null,
        foods: [
          {
            id: "6-r2-f1",
            name: "Iogurte natural desnatado coado",
            quantity: 1,
            unit: "pote (150g)",
            grams: 150,
            calories: 82,
            macros: { cho: 10, ptn: 9, lip: 0 },
            substitutions: []
          },
          {
            id: "6-r2-f2",
            name: "Mel",
            quantity: 1,
            unit: "colher de chá",
            grams: 7,
            calories: 21,
            macros: { cho: 6, ptn: 0, lip: 0 },
            substitutions: []
          }
        ]
      },
      {
        id: "6-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 520,
        observations: "Todos os legumes bem cozidos e sem cascas.",
        foods: [
          {
            id: "6-r3-f1",
            name: "Arroz branco bem cozido",
            quantity: 6,
            unit: "colher de sopa",
            grams: 120,
            calories: 163,
            macros: { cho: 36, ptn: 3, lip: 0 },
            substitutions: []
          },
          {
            id: "6-r3-f2",
            name: "Caldo de feijão coado",
            quantity: 1,
            unit: "concha",
            grams: 80,
            calories: 56,
            macros: { cho: 10, ptn: 3, lip: 0 },
            substitutions: []
          },
          {
            id: "6-r3-f3",
            name: "Frango desfiado cozido",
            quantity: 1,
            unit: "porção média",
            grams: 120,
            calories: 156,
            macros: { cho: 0, ptn: 32, lip: 3 },
            substitutions: []
          },
          {
            id: "6-r3-f4",
            name: "Cenoura bem cozida",
            quantity: 3,
            unit: "colher de sopa",
            grams: 80,
            calories: 34,
            macros: { cho: 8, ptn: 1, lip: 0 },
            substitutions: []
          }
        ]
      },
      {
        id: "6-ref4",
        name: "Lanche da tarde",
        time: "15:30",
        calories: 220,
        observations: null,
        foods: [
          {
            id: "6-r4-f1",
            name: "Biscoito de água e sal",
            quantity: 6,
            unit: "unidade",
            grams: 30,
            calories: 126,
            macros: { cho: 21, ptn: 2, lip: 4 },
            substitutions: []
          },
          {
            id: "6-r4-f2",
            name: "Queijo mussarela",
            quantity: 2,
            unit: "fatia",
            grams: 40,
            calories: 100,
            macros: { cho: 1, ptn: 8, lip: 7 },
            substitutions: []
          }
        ]
      },
      {
        id: "6-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 550,
        observations: "Macarrão bem cozido e molho coado.",
        foods: [
          {
            id: "6-r5-f1",
            name: "Macarrão branco bem cozido",
            quantity: 2,
            unit: "xícara",
            grams: 200,
            calories: 280,
            macros: { cho: 56, ptn: 10, lip: 1 },
            substitutions: []
          },
          {
            id: "6-r5-f2",
            name: "Molho de tomate coado",
            quantity: 4,
            unit: "colher de sopa",
            grams: 80,
            calories: 42,
            macros: { cho: 8, ptn: 1, lip: 1 },
            substitutions: []
          },
          {
            id: "6-r5-f3",
            name: "Patinho moído cozido",
            quantity: 1,
            unit: "porção",
            grams: 100,
            calories: 162,
            macros: { cho: 0, ptn: 26, lip: 6 },
            substitutions: []
          }
        ]
      }
    ]
  },

  {
    id: 7,
    slug: "baixo-carb-1500kcal",
    name: "Baixo Carb 1500 kcal",
    objective: "emagrecimento",
    totalCalories: 1500,
    macros: { protein: 131, carbs: 75, fat: 75 },
    mealsPerDay: 4,
    restrictions: [],
    tags: ["baixo carbo", "controle glicêmico", "emagrecimento"],
    badgeLabel: "Baixo Carb",
    badgeColor: "red",
    clinicalNotes: "Plano low-carb moderado (75g CHO/dia). Melhora sensibilidade à insulina. Indicado para pré-diabetes e obesidade.",
    contraindications: "Monitorar função renal. Atenção em atletas de alta performance.",
    patientInstructions: "Evite açúcares e amidos refinados. Prefira carboidratos de baixo índice glicêmico.",
    meals: [
      {
        id: "7-ref1",
        name: "Café da manhã",
        time: "07:30",
        calories: 340,
        observations: "Sem pão, bolacha ou cereais açucarados.",
        foods: [
          {
            id: "7-r1-f1",
            name: "Ovos mexidos (3 unidades)",
            quantity: 3,
            unit: "unidade",
            grams: 150,
            calories: 216,
            macros: { cho: 1, ptn: 19, lip: 15 },
            substitutions: []
          },
          {
            id: "7-r1-f2",
            name: "Queijo minas frescal",
            quantity: 1,
            unit: "fatia grossa",
            grams: 50,
            calories: 62,
            macros: { cho: 1, ptn: 7, lip: 3 },
            substitutions: []
          },
          {
            id: "7-r1-f3",
            name: "Morangos",
            quantity: 10,
            unit: "unidade",
            grams: 100,
            calories: 32,
            macros: { cho: 7, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s33", name: "Blueberries", quantity: 1, unit: "xícara", grams: 80, calories: 46, macros: { cho: 11, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "7-ref2",
        name: "Almoço",
        time: "13:00",
        calories: 480,
        observations: "Proteína generosa, vegetais não amiláceos à vontade.",
        foods: [
          {
            id: "7-r2-f1",
            name: "Coxa de frango assada",
            quantity: 2,
            unit: "unidade",
            grams: 200,
            calories: 330,
            macros: { cho: 0, ptn: 44, lip: 17 },
            substitutions: [
              { id: "s34", name: "Alcatra grelhada", quantity: 1, unit: "bife médio", grams: 150, calories: 270, macros: { cho: 0, ptn: 38, lip: 13 }, note: null, restriction: null }
            ]
          },
          {
            id: "7-r2-f2",
            name: "Brócolis grelhado com alho",
            quantity: 1,
            unit: "xícara",
            grams: 100,
            calories: 55,
            macros: { cho: 5, ptn: 4, lip: 3 },
            substitutions: []
          },
          {
            id: "7-r2-f3",
            name: "Arroz de couve-flor",
            quantity: 3,
            unit: "colher de sopa",
            grams: 90,
            calories: 27,
            macros: { cho: 5, ptn: 2, lip: 0 },
            substitutions: []
          }
        ]
      },
      {
        id: "7-ref3",
        name: "Lanche da tarde",
        time: "16:30",
        calories: 240,
        observations: null,
        foods: [
          {
            id: "7-r3-f1",
            name: "Whey protein",
            quantity: 1,
            unit: "scoop (25g)",
            grams: 25,
            calories: 92,
            macros: { cho: 2, ptn: 20, lip: 1 },
            substitutions: []
          },
          {
            id: "7-r3-f2",
            name: "Amendoim integral sem sal",
            quantity: 2,
            unit: "colher de sopa",
            grams: 24,
            calories: 136,
            macros: { cho: 4, ptn: 6, lip: 12 },
            substitutions: []
          }
        ]
      },
      {
        id: "7-ref4",
        name: "Jantar",
        time: "19:30",
        calories: 440,
        observations: "Sem carboidratos no jantar.",
        foods: [
          {
            id: "7-r4-f1",
            name: "Salmão grelhado",
            quantity: 1,
            unit: "filé médio",
            grams: 150,
            calories: 250,
            macros: { cho: 0, ptn: 34, lip: 12 },
            substitutions: []
          },
          {
            id: "7-r4-f2",
            name: "Espinafre refogado em azeite",
            quantity: 2,
            unit: "xícara",
            grams: 100,
            calories: 80,
            macros: { cho: 2, ptn: 3, lip: 7 },
            substitutions: []
          },
          {
            id: "7-r4-f3",
            name: "Azeite de oliva",
            quantity: 1,
            unit: "colher de sopa",
            grams: 13,
            calories: 115,
            macros: { cho: 0, ptn: 0, lip: 13 },
            substitutions: []
          }
        ]
      }
    ]
  },

  {
    id: 8,
    slug: "baixo-sodio-1800kcal",
    name: "Baixo Sódio 1800 kcal",
    objective: "manutencao",
    totalCalories: 1800,
    macros: { protein: 90, carbs: 225, fat: 60 },
    mealsPerDay: 5,
    restrictions: ["baixo_sodio"],
    tags: ["baixo sódio", "hipertensão", "cardiopatia", "< 2g Na/dia"],
    badgeLabel: "Baixo Sódio",
    badgeColor: "blue",
    clinicalNotes: "Plano hipossódico (< 2g sódio/dia). Indicado para hipertensão arterial, insuficiência cardíaca e doença renal.",
    contraindications: "Acompanhar exames de sódio sérico. Não usar substitutos de sal com potássio em pacientes renais.",
    patientInstructions: "Não adicione sal às preparações. Evite embutidos, enlatados, temperos prontos e fast food.",
    meals: [
      {
        id: "8-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 360,
        observations: "Sem sal adicionado. Use ervas aromáticas.",
        foods: [
          {
            id: "8-r1-f1",
            name: "Pão integral caseiro (sem sal)",
            quantity: 2,
            unit: "fatia",
            grams: 60,
            calories: 150,
            macros: { cho: 28, ptn: 6, lip: 2 },
            substitutions: []
          },
          {
            id: "8-r1-f2",
            name: "Ovos mexidos sem sal",
            quantity: 2,
            unit: "unidade",
            grams: 100,
            calories: 144,
            macros: { cho: 1, ptn: 13, lip: 10 },
            substitutions: []
          },
          {
            id: "8-r1-f3",
            name: "Mamão papaia",
            quantity: 1,
            unit: "fatia grande",
            grams: 200,
            calories: 80,
            macros: { cho: 20, ptn: 1, lip: 0 },
            substitutions: []
          }
        ]
      },
      {
        id: "8-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 150,
        observations: null,
        foods: [
          {
            id: "8-r2-f1",
            name: "Banana-prata",
            quantity: 1,
            unit: "unidade",
            grams: 80,
            calories: 64,
            macros: { cho: 15, ptn: 1, lip: 0 },
            substitutions: []
          },
          {
            id: "8-r2-f2",
            name: "Iogurte natural sem sal",
            quantity: 1,
            unit: "pote (100g)",
            grams: 100,
            calories: 55,
            macros: { cho: 7, ptn: 6, lip: 0 },
            substitutions: []
          }
        ]
      },
      {
        id: "8-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 520,
        observations: "Tempere com limão, alho e ervas. Sem sal de cozinha.",
        foods: [
          {
            id: "8-r3-f1",
            name: "Arroz branco sem sal",
            quantity: 6,
            unit: "colher de sopa",
            grams: 120,
            calories: 163,
            macros: { cho: 36, ptn: 3, lip: 0 },
            substitutions: []
          },
          {
            id: "8-r3-f2",
            name: "Feijão-carioca sem sal",
            quantity: 2,
            unit: "concha",
            grams: 100,
            calories: 120,
            macros: { cho: 22, ptn: 8, lip: 1 },
            substitutions: []
          },
          {
            id: "8-r3-f3",
            name: "Tilápia grelhada sem sal",
            quantity: 1,
            unit: "filé médio",
            grams: 120,
            calories: 132,
            macros: { cho: 0, ptn: 27, lip: 2 },
            substitutions: [
              { id: "s35", name: "Peito de frango grelhado sem sal", quantity: 1, unit: "filé médio", grams: 120, calories: 156, macros: { cho: 0, ptn: 32, lip: 3 }, note: null, restriction: "baixo_sodio" }
            ]
          },
          {
            id: "8-r3-f4",
            name: "Salada crua com limão",
            quantity: 1,
            unit: "prato raso",
            grams: 150,
            calories: 40,
            macros: { cho: 7, ptn: 2, lip: 0 },
            substitutions: []
          }
        ]
      },
      {
        id: "8-ref4",
        name: "Lanche da tarde",
        time: "15:30",
        calories: 200,
        observations: null,
        foods: [
          {
            id: "8-r4-f1",
            name: "Maçã",
            quantity: 1,
            unit: "unidade",
            grams: 130,
            calories: 68,
            macros: { cho: 17, ptn: 0, lip: 0 },
            substitutions: []
          },
          {
            id: "8-r4-f2",
            name: "Queijo cottage (sem sal)",
            quantity: 3,
            unit: "colher de sopa",
            grams: 60,
            calories: 54,
            macros: { cho: 2, ptn: 9, lip: 1 },
            substitutions: []
          }
        ]
      },
      {
        id: "8-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 570,
        observations: "Frango temperado apenas com alho, limão e ervas naturais.",
        foods: [
          {
            id: "8-r5-f1",
            name: "Batata-doce cozida sem sal",
            quantity: 2,
            unit: "unidade média",
            grams: 300,
            calories: 300,
            macros: { cho: 70, ptn: 4, lip: 0 },
            substitutions: []
          },
          {
            id: "8-r5-f2",
            name: "Peito de frango assado sem sal",
            quantity: 1,
            unit: "filé grande",
            grams: 150,
            calories: 195,
            macros: { cho: 0, ptn: 40, lip: 4 },
            substitutions: []
          },
          {
            id: "8-r5-f3",
            name: "Azeite de oliva",
            quantity: 1,
            unit: "colher de sobremesa",
            grams: 7,
            calories: 62,
            macros: { cho: 0, ptn: 0, lip: 7 },
            substitutions: []
          }
        ]
      }
    ]
  },

  {
    id: 9,
    slug: "fodmap-reduzido-1800kcal",
    name: "FODMAP Reduzido 1800 kcal",
    objective: "manutencao",
    totalCalories: 1800,
    macros: { protein: 90, carbs: 225, fat: 60 },
    mealsPerDay: 5,
    restrictions: ["baixo_fodmap"],
    tags: ["baixo FODMAP", "SII", "intestino irritável", "digestão"],
    badgeLabel: "FODMAP",
    badgeColor: "teal",
    clinicalNotes: "Plano com baixo teor de FODMAPs (Fermentable Oligosaccharides, Disaccharides, Monosaccharides and Polyols). Indicado para Síndrome do Intestino Irritável.",
    contraindications: "Fase de eliminação deve durar no máximo 6–8 semanas. Reintrodução gradual com acompanhamento.",
    patientInstructions: "Evite alho, cebola, trigo, leite, maçã, pera, manga e leguminosas em grandes quantidades. Use alho-poró (parte verde) como substituto do alho.",
    meals: [
      {
        id: "9-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 360,
        observations: "Use leite sem lactose ou leite vegetal (sem adição de inulina).",
        foods: [
          {
            id: "9-r1-f1",
            name: "Aveia em flocos sem glúten",
            quantity: 4,
            unit: "colher de sopa",
            grams: 40,
            calories: 148,
            macros: { cho: 26, ptn: 5, lip: 3 },
            substitutions: [
              { id: "s36", name: "Arroz inflado sem açúcar", quantity: 1, unit: "xícara", grams: 30, calories: 108, macros: { cho: 24, ptn: 2, lip: 0 }, note: "Baixo FODMAP", restriction: "baixo_fodmap" }
            ]
          },
          {
            id: "9-r1-f2",
            name: "Leite sem lactose",
            quantity: 1,
            unit: "copo (200ml)",
            grams: 200,
            calories: 68,
            macros: { cho: 9, ptn: 7, lip: 0 },
            substitutions: [
              { id: "s37", name: "Leite de arroz", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 90, macros: { cho: 20, ptn: 1, lip: 1 }, note: "Baixo FODMAP", restriction: "baixo_fodmap" }
            ]
          },
          {
            id: "9-r1-f3",
            name: "Banana-prata madura",
            quantity: 1,
            unit: "unidade pequena",
            grams: 60,
            calories: 48,
            macros: { cho: 11, ptn: 1, lip: 0 },
            substitutions: []
          }
        ]
      },
      {
        id: "9-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 170,
        observations: "Porção pequena de frutas permitidas.",
        foods: [
          {
            id: "9-r2-f1",
            name: "Uva (sem semente)",
            quantity: 15,
            unit: "unidade",
            grams: 80,
            calories: 56,
            macros: { cho: 14, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s38", name: "Kiwi", quantity: 2, unit: "unidade", grams: 130, calories: 78, macros: { cho: 18, ptn: 1, lip: 1 }, note: "Baixo FODMAP em porção controlada", restriction: "baixo_fodmap" }
            ]
          },
          {
            id: "9-r2-f2",
            name: "Queijo cheddar",
            quantity: 1,
            unit: "fatia (30g)",
            grams: 30,
            calories: 120,
            macros: { cho: 0, ptn: 7, lip: 10 },
            substitutions: []
          }
        ]
      },
      {
        id: "9-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 530,
        observations: "Sem alho, cebola ou grãos em grandes quantidades.",
        foods: [
          {
            id: "9-r3-f1",
            name: "Arroz branco cozido",
            quantity: 6,
            unit: "colher de sopa",
            grams: 120,
            calories: 163,
            macros: { cho: 36, ptn: 3, lip: 0 },
            substitutions: []
          },
          {
            id: "9-r3-f2",
            name: "Lentilha cozida (porção pequena)",
            quantity: 2,
            unit: "colher de sopa",
            grams: 40,
            calories: 46,
            macros: { cho: 8, ptn: 3, lip: 0 },
            substitutions: []
          },
          {
            id: "9-r3-f3",
            name: "Peito de frango grelhado",
            quantity: 1,
            unit: "filé médio",
            grams: 120,
            calories: 156,
            macros: { cho: 0, ptn: 32, lip: 3 },
            substitutions: []
          },
          {
            id: "9-r3-f4",
            name: "Abobrinha grelhada",
            quantity: 1,
            unit: "unidade média",
            grams: 120,
            calories: 36,
            macros: { cho: 6, ptn: 2, lip: 1 },
            substitutions: [
              { id: "s39", name: "Cenoura cozida", quantity: 3, unit: "colher de sopa", grams: 80, calories: 34, macros: { cho: 8, ptn: 1, lip: 0 }, note: "Baixo FODMAP", restriction: "baixo_fodmap" }
            ]
          }
        ]
      },
      {
        id: "9-ref4",
        name: "Lanche da tarde",
        time: "15:30",
        calories: 200,
        observations: null,
        foods: [
          {
            id: "9-r4-f1",
            name: "Biscoito de arroz",
            quantity: 4,
            unit: "unidade",
            grams: 28,
            calories: 112,
            macros: { cho: 24, ptn: 2, lip: 1 },
            substitutions: []
          },
          {
            id: "9-r4-f2",
            name: "Manteiga de amendoim natural",
            quantity: 1,
            unit: "colher de sopa",
            grams: 16,
            calories: 96,
            macros: { cho: 3, ptn: 4, lip: 8 },
            substitutions: []
          }
        ]
      },
      {
        id: "9-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 540,
        observations: "Tempere com cebolinha (parte verde) e azeite. Sem alho.",
        foods: [
          {
            id: "9-r5-f1",
            name: "Macarrão de arroz cozido",
            quantity: 2,
            unit: "xícara",
            grams: 200,
            calories: 280,
            macros: { cho: 62, ptn: 4, lip: 0 },
            substitutions: []
          },
          {
            id: "9-r5-f2",
            name: "Molho de tomate simples (sem alho/cebola)",
            quantity: 4,
            unit: "colher de sopa",
            grams: 80,
            calories: 40,
            macros: { cho: 8, ptn: 1, lip: 1 },
            substitutions: []
          },
          {
            id: "9-r5-f3",
            name: "Tilápia grelhada",
            quantity: 1,
            unit: "filé médio",
            grams: 120,
            calories: 132,
            macros: { cho: 0, ptn: 27, lip: 2 },
            substitutions: []
          }
        ]
      }
    ]
  }
,

  // ── PLANO 10 ─────────────────────────────────────────────────────────────
  {
    id: 10,
    slug: "baixo-potassio-1800kcal",
    name: "Baixo Potássio 1800 kcal",
    objective: "manutencao",
    totalCalories: 1800,
    macros: { protein: 90, carbs: 248, fat: 50 },
    mealsPerDay: 5,
    restrictions: ["baixo_potassio"],
    tags: ["baixo potássio", "doença renal", "hipercalemia"],
    badgeLabel: "Baixo K⁺",
    badgeColor: "purple",
    clinicalNotes: "Indicado para hipercalemia ou doença renal crônica. Potássio < 3g/dia. Evitar frutas e vegetais ricos em potássio.",
    contraindications: "Monitorar potássio sérico semanalmente. Não usar substitutos de sal com KCl.",
    patientInstructions: "Cozinhe legumes em água abundante e descarte a água (reduz potássio em até 50%). Evite banana, abacate, batata, espinafre e feijão em grandes quantidades.",
    meals: [
      {
        id: "10-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 350,
        observations: "Frutas de baixo potássio: maçã, pera, uva.",
        foods: [
          {
            id: "10-r1-f1",
            name: "Pão branco",
            quantity: 2, unit: "fatia", grams: 60, calories: 162,
            macros: { cho: 32, ptn: 5, lip: 1 },
            substitutions: [
              { id: "s10-1", name: "Biscoito de água e sal", quantity: 6, unit: "unidade", grams: 30, calories: 126, macros: { cho: 21, ptn: 2, lip: 4 }, note: null, restriction: null },
              { id: "s10-2", name: "Cuscuz de milho cozido", quantity: 3, unit: "colher de sopa", grams: 60, calories: 168, macros: { cho: 35, ptn: 3, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "10-r1-f2",
            name: "Cream cheese light",
            quantity: 2, unit: "colher de sopa", grams: 30, calories: 60,
            macros: { cho: 2, ptn: 3, lip: 5 },
            substitutions: [
              { id: "s10-3", name: "Margarina", quantity: 1, unit: "colher de chá", grams: 5, calories: 27, macros: { cho: 0, ptn: 0, lip: 3 }, note: null, restriction: null },
              { id: "s10-4", name: "Geleia sem adição de açúcar", quantity: 1, unit: "colher de sopa", grams: 20, calories: 22, macros: { cho: 5, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "10-r1-f3",
            name: "Maçã",
            quantity: 1, unit: "unidade média", grams: 130, calories: 68,
            macros: { cho: 17, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s10-5", name: "Pera", quantity: 1, unit: "unidade média", grams: 130, calories: 65, macros: { cho: 16, ptn: 1, lip: 0 }, note: "Baixo K⁺", restriction: "baixo_potassio" },
              { id: "s10-6", name: "Uva itália", quantity: 15, unit: "unidade", grams: 80, calories: 54, macros: { cho: 14, ptn: 1, lip: 0 }, note: "Baixo K⁺", restriction: "baixo_potassio" }
            ]
          },
          {
            id: "10-r1-f4",
            name: "Leite desnatado",
            quantity: 1, unit: "copo (200ml)", grams: 200, calories: 68,
            macros: { cho: 9, ptn: 7, lip: 0 },
            substitutions: [
              { id: "s10-7", name: "Chá sem açúcar", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 2, macros: { cho: 0, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s10-8", name: "Suco de maçã sem açúcar (100ml)", quantity: 1, unit: "copo pequeno", grams: 100, calories: 46, macros: { cho: 11, ptn: 0, lip: 0 }, note: "Verificar teor de K⁺", restriction: null }
            ]
          }
        ]
      },
      {
        id: "10-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 160,
        observations: null,
        foods: [
          {
            id: "10-r2-f1",
            name: "Torrada branca",
            quantity: 3, unit: "unidade", grams: 30, calories: 120,
            macros: { cho: 24, ptn: 3, lip: 2 },
            substitutions: [
              { id: "s10-9", name: "Biscoito tipo cream cracker", quantity: 4, unit: "unidade", grams: 28, calories: 112, macros: { cho: 18, ptn: 2, lip: 4 }, note: null, restriction: null },
              { id: "s10-10", name: "Pão de forma branco", quantity: 1, unit: "fatia", grams: 25, calories: 67, macros: { cho: 13, ptn: 2, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "10-r2-f2",
            name: "Queijo mussarela",
            quantity: 1, unit: "fatia", grams: 20, calories: 50,
            macros: { cho: 0, ptn: 4, lip: 4 },
            substitutions: [
              { id: "s10-11", name: "Ricota fresca", quantity: 2, unit: "colher de sopa", grams: 40, calories: 48, macros: { cho: 1, ptn: 5, lip: 3 }, note: null, restriction: null },
              { id: "s10-12", name: "Peito de peru fatiado", quantity: 2, unit: "fatia", grams: 20, calories: 24, macros: { cho: 0, ptn: 4, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "10-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 510,
        observations: "Cozinhe os vegetais em água abundante e descarte a água antes de servir.",
        foods: [
          {
            id: "10-r3-f1",
            name: "Arroz branco cozido",
            quantity: 6, unit: "colher de sopa", grams: 120, calories: 163,
            macros: { cho: 36, ptn: 3, lip: 0 },
            substitutions: [
              { id: "s10-13", name: "Macarrão branco cozido", quantity: 2, unit: "xícara", grams: 160, calories: 224, macros: { cho: 45, ptn: 7, lip: 1 }, note: null, restriction: null },
              { id: "s10-14", name: "Polenta cozida", quantity: 3, unit: "colher de sopa", grams: 80, calories: 100, macros: { cho: 22, ptn: 2, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "10-r3-f2",
            name: "Peito de frango grelhado",
            quantity: 1, unit: "filé médio", grams: 120, calories: 156,
            macros: { cho: 0, ptn: 32, lip: 3 },
            substitutions: [
              { id: "s10-15", name: "Tilápia grelhada", quantity: 1, unit: "filé médio", grams: 120, calories: 132, macros: { cho: 0, ptn: 27, lip: 2 }, note: null, restriction: null },
              { id: "s10-16", name: "Ovo cozido", quantity: 3, unit: "unidade", grams: 150, calories: 216, macros: { cho: 1, ptn: 19, lip: 15 }, note: null, restriction: null }
            ]
          },
          {
            id: "10-r3-f3",
            name: "Cenoura cozida (água descartada)",
            quantity: 3, unit: "colher de sopa", grams: 80, calories: 34,
            macros: { cho: 8, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s10-17", name: "Chuchu cozido", quantity: 3, unit: "colher de sopa", grams: 80, calories: 22, macros: { cho: 5, ptn: 1, lip: 0 }, note: "Baixo K⁺", restriction: "baixo_potassio" },
              { id: "s10-18", name: "Abobrinha cozida", quantity: 3, unit: "colher de sopa", grams: 80, calories: 24, macros: { cho: 5, ptn: 1, lip: 0 }, note: "Baixo K⁺", restriction: "baixo_potassio" }
            ]
          },
          {
            id: "10-r3-f4",
            name: "Azeite de oliva",
            quantity: 1, unit: "colher de sobremesa", grams: 7, calories: 62,
            macros: { cho: 0, ptn: 0, lip: 7 },
            substitutions: [
              { id: "s10-19", name: "Manteiga sem sal", quantity: 1, unit: "colher de chá", grams: 5, calories: 36, macros: { cho: 0, ptn: 0, lip: 4 }, note: null, restriction: null },
              { id: "s10-20", name: "Óleo de canola", quantity: 1, unit: "colher de sobremesa", grams: 7, calories: 62, macros: { cho: 0, ptn: 0, lip: 7 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "10-ref4",
        name: "Lanche da tarde",
        time: "15:30",
        calories: 190,
        observations: null,
        foods: [
          {
            id: "10-r4-f1",
            name: "Iogurte natural desnatado",
            quantity: 1, unit: "pote (100g)", grams: 100, calories: 55,
            macros: { cho: 7, ptn: 6, lip: 0 },
            substitutions: [
              { id: "s10-21", name: "Queijo cottage", quantity: 3, unit: "colher de sopa", grams: 60, calories: 54, macros: { cho: 2, ptn: 9, lip: 1 }, note: null, restriction: null },
              { id: "s10-22", name: "Ricota com mel", quantity: 2, unit: "colher de sopa", grams: 40, calories: 58, macros: { cho: 5, ptn: 5, lip: 3 }, note: null, restriction: null }
            ]
          },
          {
            id: "10-r4-f2",
            name: "Pera",
            quantity: 1, unit: "unidade média", grams: 130, calories: 65,
            macros: { cho: 16, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s10-23", name: "Maçã", quantity: 1, unit: "unidade média", grams: 130, calories: 68, macros: { cho: 17, ptn: 0, lip: 0 }, note: "Baixo K⁺", restriction: "baixo_potassio" },
              { id: "s10-24", name: "Uva", quantity: 15, unit: "unidade", grams: 80, calories: 54, macros: { cho: 14, ptn: 1, lip: 0 }, note: "Baixo K⁺", restriction: "baixo_potassio" }
            ]
          }
        ]
      },
      {
        id: "10-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 590,
        observations: null,
        foods: [
          {
            id: "10-r5-f1",
            name: "Macarrão branco cozido",
            quantity: 2, unit: "xícara", grams: 200, calories: 280,
            macros: { cho: 56, ptn: 10, lip: 1 },
            substitutions: [
              { id: "s10-25", name: "Arroz branco cozido", quantity: 8, unit: "colher de sopa", grams: 160, calories: 218, macros: { cho: 48, ptn: 4, lip: 0 }, note: null, restriction: null },
              { id: "s10-26", name: "Polenta firme", quantity: 1, unit: "fatia grande", grams: 150, calories: 156, macros: { cho: 33, ptn: 3, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "10-r5-f2",
            name: "Patinho moído grelhado",
            quantity: 1, unit: "porção", grams: 120, calories: 194,
            macros: { cho: 0, ptn: 31, lip: 8 },
            substitutions: [
              { id: "s10-27", name: "Frango desfiado", quantity: 1, unit: "porção", grams: 120, calories: 156, macros: { cho: 0, ptn: 32, lip: 3 }, note: null, restriction: null },
              { id: "s10-28", name: "Atum em água", quantity: 1, unit: "lata (120g)", grams: 120, calories: 132, macros: { cho: 0, ptn: 28, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "10-r5-f3",
            name: "Alface + pepino",
            quantity: 1, unit: "prato raso", grams: 100, calories: 20,
            macros: { cho: 3, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s10-29", name: "Alface + repolho cru", quantity: 1, unit: "prato raso", grams: 100, calories: 22, macros: { cho: 4, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s10-30", name: "Rúcula + cenoura ralada", quantity: 1, unit: "prato raso", grams: 100, calories: 28, macros: { cho: 5, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },

  // ── PLANO 11 ─────────────────────────────────────────────────────────────
  {
    id: 11,
    slug: "baixa-gordura-1600kcal",
    name: "Baixa Gordura 1600 kcal",
    objective: "emagrecimento",
    totalCalories: 1600,
    macros: { protein: 100, carbs: 240, fat: 27 },
    mealsPerDay: 5,
    restrictions: [],
    tags: ["baixa gordura", "colesterol", "saúde cardiovascular"],
    badgeLabel: "Baixa Gordura",
    badgeColor: "blue",
    clinicalNotes: "Plano hipogorduroso (< 30g lipídios/dia). Indicado para hipercolesterolemia, esteatose hepática e doenças cardiovasculares.",
    contraindications: "Não eliminar gorduras completamente — vitaminas lipossolúveis (A, D, E, K) dependem de gordura para absorção.",
    patientInstructions: "Prefira preparações grelhadas, assadas ou cozidas. Retire a pele do frango e a gordura visível das carnes.",
    meals: [
      {
        id: "11-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 310,
        observations: "Sem adição de gordura nas preparações.",
        foods: [
          {
            id: "11-r1-f1",
            name: "Aveia em flocos",
            quantity: 4, unit: "colher de sopa", grams: 40, calories: 148,
            macros: { cho: 26, ptn: 5, lip: 3 },
            substitutions: [
              { id: "s11-1", name: "Granola light", quantity: 3, unit: "colher de sopa", grams: 30, calories: 110, macros: { cho: 22, ptn: 3, lip: 2 }, note: null, restriction: null },
              { id: "s11-2", name: "Quinoa em flocos", quantity: 3, unit: "colher de sopa", grams: 30, calories: 108, macros: { cho: 20, ptn: 4, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "11-r1-f2",
            name: "Leite desnatado",
            quantity: 1, unit: "copo (250ml)", grams: 250, calories: 85,
            macros: { cho: 12, ptn: 9, lip: 0 },
            substitutions: [
              { id: "s11-3", name: "Iogurte desnatado", quantity: 1, unit: "pote (170g)", grams: 170, calories: 93, macros: { cho: 13, ptn: 10, lip: 0 }, note: null, restriction: null },
              { id: "s11-4", name: "Leite de aveia light", quantity: 1, unit: "copo (250ml)", grams: 250, calories: 90, macros: { cho: 16, ptn: 3, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "11-r1-f3",
            name: "Mamão papaia",
            quantity: 1, unit: "fatia média", grams: 120, calories: 48,
            macros: { cho: 12, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s11-5", name: "Melão", quantity: 1, unit: "fatia", grams: 150, calories: 52, macros: { cho: 13, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s11-6", name: "Melancia", quantity: 1, unit: "fatia", grams: 200, calories: 60, macros: { cho: 15, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "11-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 150,
        observations: null,
        foods: [
          {
            id: "11-r2-f1",
            name: "Iogurte grego desnatado",
            quantity: 1, unit: "pote (100g)", grams: 100, calories: 57,
            macros: { cho: 4, ptn: 10, lip: 0 },
            substitutions: [
              { id: "s11-7", name: "Queijo cottage desnatado", quantity: 4, unit: "colher de sopa", grams: 80, calories: 72, macros: { cho: 3, ptn: 12, lip: 1 }, note: null, restriction: null },
              { id: "s11-8", name: "Clara de ovo cozida", quantity: 3, unit: "unidade", grams: 99, calories: 51, macros: { cho: 1, ptn: 11, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "11-r2-f2",
            name: "Banana-prata pequena",
            quantity: 1, unit: "unidade", grams: 60, calories: 48,
            macros: { cho: 11, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s11-9", name: "Maçã", quantity: 1, unit: "unidade", grams: 100, calories: 52, macros: { cho: 13, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s11-10", name: "Pera", quantity: 1, unit: "unidade", grams: 100, calories: 50, macros: { cho: 12, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "11-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 470,
        observations: "Sem óleo na preparação — use caldo de legumes para refogar.",
        foods: [
          {
            id: "11-r3-f1",
            name: "Arroz integral cozido",
            quantity: 5, unit: "colher de sopa", grams: 100, calories: 140,
            macros: { cho: 29, ptn: 3, lip: 1 },
            substitutions: [
              { id: "s11-11", name: "Quinoa cozida", quantity: 4, unit: "colher de sopa", grams: 80, calories: 108, macros: { cho: 18, ptn: 5, lip: 2 }, note: null, restriction: null },
              { id: "s11-12", name: "Batata-doce cozida", quantity: 2, unit: "unidade pequena", grams: 100, calories: 100, macros: { cho: 23, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "11-r3-f2",
            name: "Feijão-carioca cozido",
            quantity: 2, unit: "concha", grams: 100, calories: 120,
            macros: { cho: 22, ptn: 8, lip: 1 },
            substitutions: [
              { id: "s11-13", name: "Lentilha cozida", quantity: 3, unit: "colher de sopa", grams: 60, calories: 69, macros: { cho: 12, ptn: 5, lip: 0 }, note: null, restriction: null },
              { id: "s11-14", name: "Ervilha cozida", quantity: 3, unit: "colher de sopa", grams: 60, calories: 50, macros: { cho: 9, ptn: 4, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "11-r3-f3",
            name: "Peito de frango cozido sem pele",
            quantity: 1, unit: "filé grande", grams: 150, calories: 165,
            macros: { cho: 0, ptn: 37, lip: 2 },
            substitutions: [
              { id: "s11-15", name: "Peixe branco cozido", quantity: 1, unit: "filé grande", grams: 150, calories: 150, macros: { cho: 0, ptn: 32, lip: 2 }, note: null, restriction: null },
              { id: "s11-16", name: "Atum em água escorrido", quantity: 1, unit: "lata (120g)", grams: 120, calories: 132, macros: { cho: 0, ptn: 28, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "11-r3-f4",
            name: "Salada crua variada",
            quantity: 1, unit: "prato", grams: 150, calories: 35,
            macros: { cho: 6, ptn: 2, lip: 0 },
            substitutions: [
              { id: "s11-17", name: "Brócolis cozido", quantity: 1, unit: "xícara", grams: 100, calories: 34, macros: { cho: 5, ptn: 3, lip: 0 }, note: null, restriction: null },
              { id: "s11-18", name: "Couve-flor cozida", quantity: 1, unit: "xícara", grams: 100, calories: 25, macros: { cho: 4, ptn: 2, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "11-ref4",
        name: "Lanche da tarde",
        time: "15:30",
        calories: 160,
        observations: null,
        foods: [
          {
            id: "11-r4-f1",
            name: "Maçã",
            quantity: 1, unit: "unidade média", grams: 130, calories: 68,
            macros: { cho: 17, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s11-19", name: "Pera", quantity: 1, unit: "unidade média", grams: 130, calories: 65, macros: { cho: 16, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s11-20", name: "Laranja-pera", quantity: 1, unit: "unidade média", grams: 130, calories: 62, macros: { cho: 15, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "11-r4-f2",
            name: "Iogurte desnatado sem sabor",
            quantity: 1, unit: "pote (100g)", grams: 100, calories: 55,
            macros: { cho: 7, ptn: 6, lip: 0 },
            substitutions: [
              { id: "s11-21", name: "Clara de ovo cozida (2 un)", quantity: 2, unit: "unidade", grams: 66, calories: 34, macros: { cho: 1, ptn: 7, lip: 0 }, note: null, restriction: null },
              { id: "s11-22", name: "Queijo cottage light", quantity: 3, unit: "colher de sopa", grams: 60, calories: 50, macros: { cho: 2, ptn: 8, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "11-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 510,
        observations: "Prefira cozido, assado ou grelhado sem óleo.",
        foods: [
          {
            id: "11-r5-f1",
            name: "Batata-doce cozida",
            quantity: 2, unit: "unidade média", grams: 200, calories: 200,
            macros: { cho: 47, ptn: 3, lip: 0 },
            substitutions: [
              { id: "s11-23", name: "Arroz branco cozido", quantity: 6, unit: "colher de sopa", grams: 120, calories: 163, macros: { cho: 36, ptn: 3, lip: 0 }, note: null, restriction: null },
              { id: "s11-24", name: "Mandioca cozida", quantity: 1, unit: "porção", grams: 120, calories: 181, macros: { cho: 43, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "11-r5-f2",
            name: "Salmão grelhado (porção magra)",
            quantity: 1, unit: "filé pequeno", grams: 100, calories: 166,
            macros: { cho: 0, ptn: 23, lip: 8 },
            substitutions: [
              { id: "s11-25", name: "Tilápia grelhada", quantity: 1, unit: "filé médio", grams: 120, calories: 132, macros: { cho: 0, ptn: 27, lip: 2 }, note: "Mais magra", restriction: null },
              { id: "s11-26", name: "Frango desfiado cozido", quantity: 1, unit: "porção", grams: 120, calories: 156, macros: { cho: 0, ptn: 32, lip: 3 }, note: null, restriction: null }
            ]
          },
          {
            id: "11-r5-f3",
            name: "Brócolis + cenoura cozidos",
            quantity: 1, unit: "xícara mista", grams: 120, calories: 50,
            macros: { cho: 9, ptn: 3, lip: 0 },
            substitutions: [
              { id: "s11-27", name: "Abobrinha + couve-flor", quantity: 1, unit: "xícara mista", grams: 120, calories: 36, macros: { cho: 7, ptn: 2, lip: 0 }, note: null, restriction: null },
              { id: "s11-28", name: "Vagem + cenoura", quantity: 1, unit: "xícara mista", grams: 120, calories: 45, macros: { cho: 9, ptn: 2, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },

  // ── PLANO 12 ─────────────────────────────────────────────────────────────
  {
    id: 12,
    slug: "pre-pos-treino-1500kcal",
    name: "Pré/Pós Treino 1500 kcal",
    objective: "emagrecimento",
    totalCalories: 1500,
    macros: { protein: 94, carbs: 188, fat: 42 },
    mealsPerDay: 4,
    restrictions: [],
    tags: ["pré-treino", "pós-treino", "atletas", "emagrecimento ativo"],
    badgeLabel: "Pré/Pós Treino",
    badgeColor: "red",
    clinicalNotes: "Plano com janela anabólica otimizada. CHO pré-treino para performance e PTN pós-treino para recuperação.",
    contraindications: "Ajustar horários conforme horário do treino do paciente.",
    patientInstructions: "Consuma o lanche pré-treino 60 min antes do exercício. O pós-treino deve ser ingerido até 30 min após o término.",
    meals: [
      {
        id: "12-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 380,
        observations: "Refeição completa para começar o dia.",
        foods: [
          {
            id: "12-r1-f1",
            name: "Ovos mexidos (3 unidades)",
            quantity: 3, unit: "unidade", grams: 150, calories: 216,
            macros: { cho: 1, ptn: 19, lip: 15 },
            substitutions: [
              { id: "s12-1", name: "Omelete de claras (4 un)", quantity: 4, unit: "clara", grams: 132, calories: 68, macros: { cho: 1, ptn: 14, lip: 0 }, note: null, restriction: null },
              { id: "s12-2", name: "Iogurte grego + whey", quantity: 1, unit: "pote + 1 scoop", grams: 125, calories: 185, macros: { cho: 6, ptn: 30, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "12-r1-f2",
            name: "Pão integral",
            quantity: 2, unit: "fatia", grams: 60, calories: 156,
            macros: { cho: 28, ptn: 6, lip: 2 },
            substitutions: [
              { id: "s12-3", name: "Aveia em flocos (4 col)", quantity: 4, unit: "colher de sopa", grams: 40, calories: 148, macros: { cho: 26, ptn: 5, lip: 3 }, note: null, restriction: null },
              { id: "s12-4", name: "Tapioca recheada", quantity: 1, unit: "unidade média", grams: 50, calories: 170, macros: { cho: 40, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "12-ref2",
        name: "Pré-treino",
        time: "11:00",
        calories: 280,
        observations: "Consumir 60 min antes do treino. Rico em CHO de médio IG.",
        foods: [
          {
            id: "12-r2-f1",
            name: "Batata-doce cozida",
            quantity: 1, unit: "unidade média", grams: 150, calories: 150,
            macros: { cho: 35, ptn: 2, lip: 0 },
            substitutions: [
              { id: "s12-5", name: "Banana-prata", quantity: 2, unit: "unidade", grams: 160, calories: 128, macros: { cho: 30, ptn: 2, lip: 0 }, note: null, restriction: null },
              { id: "s12-6", name: "Arroz branco + frango (100g)", quantity: 1, unit: "porção", grams: 180, calories: 243, macros: { cho: 36, ptn: 16, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "12-r2-f2",
            name: "Whey protein (1 scoop)",
            quantity: 1, unit: "scoop (25g)", grams: 25, calories: 92,
            macros: { cho: 2, ptn: 20, lip: 1 },
            substitutions: [
              { id: "s12-7", name: "Iogurte grego desnatado", quantity: 1, unit: "pote (170g)", grams: 170, calories: 97, macros: { cho: 7, ptn: 17, lip: 0 }, note: null, restriction: null },
              { id: "s12-8", name: "Ovo cozido", quantity: 2, unit: "unidade", grams: 100, calories: 144, macros: { cho: 1, ptn: 13, lip: 10 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "12-ref3",
        name: "Pós-treino",
        time: "13:30",
        calories: 450,
        observations: "Consumir até 30 min após o treino para maximizar síntese muscular.",
        foods: [
          {
            id: "12-r3-f1",
            name: "Arroz branco cozido",
            quantity: 6, unit: "colher de sopa", grams: 120, calories: 163,
            macros: { cho: 36, ptn: 3, lip: 0 },
            substitutions: [
              { id: "s12-9", name: "Macarrão cozido", quantity: 1, unit: "xícara", grams: 100, calories: 140, macros: { cho: 28, ptn: 5, lip: 1 }, note: null, restriction: null },
              { id: "s12-10", name: "Batata cozida", quantity: 2, unit: "unidade média", grams: 200, calories: 154, macros: { cho: 35, ptn: 4, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "12-r3-f2",
            name: "Peito de frango grelhado",
            quantity: 1, unit: "filé grande", grams: 150, calories: 195,
            macros: { cho: 0, ptn: 40, lip: 4 },
            substitutions: [
              { id: "s12-11", name: "Atum em água", quantity: 1, unit: "lata (120g)", grams: 120, calories: 132, macros: { cho: 0, ptn: 28, lip: 2 }, note: null, restriction: null },
              { id: "s12-12", name: "Tilápia grelhada", quantity: 1, unit: "filé grande", grams: 150, calories: 165, macros: { cho: 0, ptn: 34, lip: 3 }, note: null, restriction: null }
            ]
          },
          {
            id: "12-r3-f3",
            name: "Feijão-carioca",
            quantity: 1, unit: "concha", grams: 60, calories: 72,
            macros: { cho: 13, ptn: 5, lip: 0 },
            substitutions: [
              { id: "s12-13", name: "Lentilha cozida", quantity: 3, unit: "colher de sopa", grams: 60, calories: 69, macros: { cho: 12, ptn: 5, lip: 0 }, note: null, restriction: null },
              { id: "s12-14", name: "Grão-de-bico cozido", quantity: 3, unit: "colher de sopa", grams: 60, calories: 80, macros: { cho: 14, ptn: 4, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "12-ref4",
        name: "Jantar",
        time: "20:00",
        calories: 390,
        observations: "Refeição noturna com proteína para recuperação.",
        foods: [
          {
            id: "12-r4-f1",
            name: "Salmão grelhado",
            quantity: 1, unit: "filé médio", grams: 150, calories: 250,
            macros: { cho: 0, ptn: 34, lip: 12 },
            substitutions: [
              { id: "s12-15", name: "Frango assado", quantity: 1, unit: "filé grande", grams: 150, calories: 195, macros: { cho: 0, ptn: 40, lip: 4 }, note: null, restriction: null },
              { id: "s12-16", name: "Omelete de 3 ovos", quantity: 1, unit: "unidade", grams: 150, calories: 216, macros: { cho: 1, ptn: 19, lip: 15 }, note: null, restriction: null }
            ]
          },
          {
            id: "12-r4-f2",
            name: "Brócolis grelhado",
            quantity: 1, unit: "xícara", grams: 100, calories: 55,
            macros: { cho: 5, ptn: 4, lip: 3 },
            substitutions: [
              { id: "s12-17", name: "Espinafre refogado", quantity: 2, unit: "xícara", grams: 100, calories: 40, macros: { cho: 3, ptn: 4, lip: 2 }, note: null, restriction: null },
              { id: "s12-18", name: "Couve-flor cozida", quantity: 1, unit: "xícara", grams: 100, calories: 25, macros: { cho: 4, ptn: 2, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },

  // ── PLANO 13 ─────────────────────────────────────────────────────────────
  {
    id: 13,
    slug: "pre-pos-treino-1800kcal",
    name: "Pré/Pós Treino 1800 kcal",
    objective: "hipertrofia",
    totalCalories: 1800,
    macros: { protein: 112, carbs: 225, fat: 50 },
    mealsPerDay: 5,
    restrictions: [],
    tags: ["pré-treino", "pós-treino", "hipertrofia moderada"],
    badgeLabel: "Pré/Pós Treino",
    badgeColor: "red",
    clinicalNotes: "Plano intermediário para ganho muscular com foco no timing nutricional.",
    contraindications: "Ajustar janela pré e pós-treino conforme horário de treino do paciente.",
    patientInstructions: "Distribua as proteínas igualmente entre as refeições para otimizar síntese proteica.",
    meals: [
      {
        id: "13-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 380,
        observations: null,
        foods: [
          {
            id: "13-r1-f1",
            name: "Ovos mexidos (3 un)",
            quantity: 3, unit: "unidade", grams: 150, calories: 216,
            macros: { cho: 1, ptn: 19, lip: 15 },
            substitutions: [
              { id: "s13-1", name: "Omelete de 3 ovos com queijo", quantity: 1, unit: "unidade", grams: 160, calories: 250, macros: { cho: 1, ptn: 22, lip: 18 }, note: null, restriction: null },
              { id: "s13-2", name: "Whey + leite + banana", quantity: 1, unit: "shake", grams: 300, calories: 310, macros: { cho: 38, ptn: 28, lip: 3 }, note: null, restriction: null }
            ]
          },
          {
            id: "13-r1-f2",
            name: "Aveia em flocos",
            quantity: 5, unit: "colher de sopa", grams: 50, calories: 185,
            macros: { cho: 33, ptn: 6, lip: 4 },
            substitutions: [
              { id: "s13-3", name: "Pão integral (2 fatias)", quantity: 2, unit: "fatia", grams: 60, calories: 156, macros: { cho: 28, ptn: 6, lip: 2 }, note: null, restriction: null },
              { id: "s13-4", name: "Granola light", quantity: 4, unit: "colher de sopa", grams: 40, calories: 150, macros: { cho: 28, ptn: 4, lip: 3 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "13-ref2",
        name: "Pré-treino",
        time: "10:30",
        calories: 300,
        observations: "60 minutos antes do treino.",
        foods: [
          {
            id: "13-r2-f1",
            name: "Banana-prata",
            quantity: 2, unit: "unidade", grams: 160, calories: 128,
            macros: { cho: 30, ptn: 2, lip: 0 },
            substitutions: [
              { id: "s13-5", name: "Batata-doce cozida", quantity: 1, unit: "unidade média", grams: 150, calories: 150, macros: { cho: 35, ptn: 2, lip: 0 }, note: null, restriction: null },
              { id: "s13-6", name: "Tapioca (2 un)", quantity: 2, unit: "unidade", grams: 80, calories: 272, macros: { cho: 64, ptn: 2, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "13-r2-f2",
            name: "Whey protein",
            quantity: 1, unit: "scoop (25g)", grams: 25, calories: 92,
            macros: { cho: 2, ptn: 20, lip: 1 },
            substitutions: [
              { id: "s13-7", name: "Iogurte grego desnatado", quantity: 1, unit: "pote (170g)", grams: 170, calories: 97, macros: { cho: 7, ptn: 17, lip: 0 }, note: null, restriction: null },
              { id: "s13-8", name: "Ovo cozido (2 un)", quantity: 2, unit: "unidade", grams: 100, calories: 144, macros: { cho: 1, ptn: 13, lip: 10 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "13-ref3",
        name: "Almoço/Pós-treino",
        time: "13:00",
        calories: 560,
        observations: "Consumir até 30 min pós-treino.",
        foods: [
          {
            id: "13-r3-f1",
            name: "Arroz branco cozido",
            quantity: 8, unit: "colher de sopa", grams: 160, calories: 218,
            macros: { cho: 48, ptn: 4, lip: 0 },
            substitutions: [
              { id: "s13-9", name: "Macarrão cozido", quantity: 2, unit: "xícara", grams: 200, calories: 280, macros: { cho: 56, ptn: 10, lip: 1 }, note: null, restriction: null },
              { id: "s13-10", name: "Batata cozida", quantity: 3, unit: "unidade média", grams: 300, calories: 231, macros: { cho: 52, ptn: 6, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "13-r3-f2",
            name: "Peito de frango grelhado",
            quantity: 1, unit: "filé grande", grams: 150, calories: 195,
            macros: { cho: 0, ptn: 40, lip: 4 },
            substitutions: [
              { id: "s13-11", name: "Carne bovina magra", quantity: 1, unit: "bife médio", grams: 120, calories: 180, macros: { cho: 0, ptn: 30, lip: 6 }, note: null, restriction: null },
              { id: "s13-12", name: "Atum + ovos mexidos", quantity: 1, unit: "porção", grams: 160, calories: 200, macros: { cho: 1, ptn: 38, lip: 6 }, note: null, restriction: null }
            ]
          },
          {
            id: "13-r3-f3",
            name: "Feijão cozido",
            quantity: 2, unit: "concha", grams: 100, calories: 120,
            macros: { cho: 22, ptn: 8, lip: 1 },
            substitutions: [
              { id: "s13-13", name: "Lentilha cozida", quantity: 4, unit: "colher de sopa", grams: 80, calories: 92, macros: { cho: 16, ptn: 6, lip: 0 }, note: null, restriction: null },
              { id: "s13-14", name: "Grão-de-bico cozido", quantity: 3, unit: "colher de sopa", grams: 60, calories: 80, macros: { cho: 14, ptn: 4, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "13-ref4",
        name: "Lanche da tarde",
        time: "16:00",
        calories: 220,
        observations: null,
        foods: [
          {
            id: "13-r4-f1",
            name: "Iogurte grego + mel",
            quantity: 1, unit: "pote (200g) + 1 col", grams: 207, calories: 160,
            macros: { cho: 16, ptn: 18, lip: 4 },
            substitutions: [
              { id: "s13-15", name: "Queijo cottage + mel", quantity: 4, unit: "col sopa + mel", grams: 87, calories: 110, macros: { cho: 8, ptn: 14, lip: 2 }, note: null, restriction: null },
              { id: "s13-16", name: "Whey + água + banana", quantity: 1, unit: "shake", grams: 285, calories: 220, macros: { cho: 32, ptn: 22, lip: 2 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "13-ref5",
        name: "Jantar",
        time: "20:00",
        calories: 340,
        observations: null,
        foods: [
          {
            id: "13-r5-f1",
            name: "Salmão grelhado",
            quantity: 1, unit: "filé médio", grams: 150, calories: 250,
            macros: { cho: 0, ptn: 34, lip: 12 },
            substitutions: [
              { id: "s13-17", name: "Frango assado", quantity: 1, unit: "filé grande", grams: 150, calories: 195, macros: { cho: 0, ptn: 40, lip: 4 }, note: null, restriction: null },
              { id: "s13-18", name: "Omelete de 3 ovos", quantity: 1, unit: "unidade", grams: 150, calories: 216, macros: { cho: 1, ptn: 19, lip: 15 }, note: null, restriction: null }
            ]
          },
          {
            id: "13-r5-f2",
            name: "Salada + legumes cozidos",
            quantity: 1, unit: "prato", grams: 150, calories: 50,
            macros: { cho: 9, ptn: 3, lip: 0 },
            substitutions: [
              { id: "s13-19", name: "Brócolis + cenoura", quantity: 1, unit: "xícara mista", grams: 120, calories: 44, macros: { cho: 8, ptn: 3, lip: 0 }, note: null, restriction: null },
              { id: "s13-20", name: "Abobrinha + pimentão", quantity: 1, unit: "xícara mista", grams: 120, calories: 35, macros: { cho: 7, ptn: 2, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },

  // ── PLANO 14 ─────────────────────────────────────────────────────────────
  {
    id: 14,
    slug: "pre-pos-treino-2000kcal",
    name: "Pré/Pós Treino 2000 kcal",
    objective: "hipertrofia",
    totalCalories: 2000,
    macros: { protein: 125, carbs: 250, fat: 56 },
    mealsPerDay: 5,
    restrictions: [],
    tags: ["pré-treino", "pós-treino", "hipertrofia avançada", "performance"],
    badgeLabel: "Pré/Pós Treino",
    badgeColor: "red",
    clinicalNotes: "Plano para atletas com alto gasto energético. Timing nutricional é fundamental para resultado.",
    contraindications: "Monitorar composição corporal a cada 4 semanas.",
    patientInstructions: "Hidratação redobrada (40ml/kg/dia). Cafeína 3–5mg/kg pode ser usada como ergogênico antes do treino.",
    meals: [
      {
        id: "14-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 450,
        observations: null,
        foods: [
          {
            id: "14-r1-f1",
            name: "Ovos mexidos (4 un)",
            quantity: 4, unit: "unidade", grams: 200, calories: 288,
            macros: { cho: 1, ptn: 25, lip: 20 },
            substitutions: [
              { id: "s14-1", name: "Omelete com queijo e peito de peru", quantity: 1, unit: "unidade grande", grams: 200, calories: 310, macros: { cho: 2, ptn: 30, lip: 20 }, note: null, restriction: null },
              { id: "s14-2", name: "Scramble de claras (5) + 1 gema", quantity: 1, unit: "porção", grams: 180, calories: 200, macros: { cho: 1, ptn: 28, lip: 8 }, note: null, restriction: null }
            ]
          },
          {
            id: "14-r1-f2",
            name: "Aveia em flocos",
            quantity: 6, unit: "colher de sopa", grams: 60, calories: 222,
            macros: { cho: 39, ptn: 8, lip: 4 },
            substitutions: [
              { id: "s14-3", name: "Pão integral (3 fatias)", quantity: 3, unit: "fatia", grams: 90, calories: 234, macros: { cho: 42, ptn: 9, lip: 3 }, note: null, restriction: null },
              { id: "s14-4", name: "Granola + frutas vermelhas", quantity: 1, unit: "porção", grams: 80, calories: 280, macros: { cho: 44, ptn: 6, lip: 8 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "14-ref2",
        name: "Pré-treino",
        time: "10:30",
        calories: 360,
        observations: "60 minutos antes. CHO de médio-alto IG para energia imediata.",
        foods: [
          {
            id: "14-r2-f1",
            name: "Batata-doce + frango",
            quantity: 1, unit: "porção (150g+120g)", grams: 270, calories: 345,
            macros: { cho: 37, ptn: 42, lip: 4 },
            substitutions: [
              { id: "s14-5", name: "Macarrão + atum", quantity: 1, unit: "porção", grams: 220, calories: 300, macros: { cho: 42, ptn: 26, lip: 2 }, note: null, restriction: null },
              { id: "s14-6", name: "Banana + whey + leite", quantity: 1, unit: "shake", grams: 360, calories: 350, macros: { cho: 45, ptn: 30, lip: 4 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "14-ref3",
        name: "Pós-treino",
        time: "13:30",
        calories: 550,
        observations: "Janela anabólica: consumir até 30 min após o treino.",
        foods: [
          {
            id: "14-r3-f1",
            name: "Arroz branco cozido",
            quantity: 8, unit: "colher de sopa", grams: 160, calories: 218,
            macros: { cho: 48, ptn: 4, lip: 0 },
            substitutions: [
              { id: "s14-7", name: "Batata inglesa cozida", quantity: 3, unit: "unidade média", grams: 300, calories: 231, macros: { cho: 52, ptn: 6, lip: 0 }, note: null, restriction: null },
              { id: "s14-8", name: "Macarrão integral", quantity: 2, unit: "xícara", grams: 200, calories: 280, macros: { cho: 55, ptn: 10, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "14-r3-f2",
            name: "Frango grelhado",
            quantity: 2, unit: "filé médio", grams: 240, calories: 312,
            macros: { cho: 0, ptn: 64, lip: 6 },
            substitutions: [
              { id: "s14-9", name: "Carne bovina grelhada", quantity: 2, unit: "bife médio", grams: 240, calories: 360, macros: { cho: 0, ptn: 60, lip: 14 }, note: null, restriction: null },
              { id: "s14-10", name: "Atum + ovos cozidos", quantity: 1, unit: "porção combinada", grams: 220, calories: 276, macros: { cho: 1, ptn: 55, lip: 10 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "14-ref4",
        name: "Lanche da tarde",
        time: "16:30",
        calories: 300,
        observations: null,
        foods: [
          {
            id: "14-r4-f1",
            name: "Shake de whey (2 scoops) + leite + banana",
            quantity: 1, unit: "shake", grams: 440, calories: 420,
            macros: { cho: 50, ptn: 42, lip: 5 },
            substitutions: [
              { id: "s14-11", name: "Iogurte grego + granola + mel", quantity: 1, unit: "tigela", grams: 250, calories: 350, macros: { cho: 46, ptn: 22, lip: 8 }, note: null, restriction: null },
              { id: "s14-12", name: "Queijo cottage + pasta amendoim + banana", quantity: 1, unit: "tigela", grams: 230, calories: 390, macros: { cho: 35, ptn: 28, lip: 14 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "14-ref5",
        name: "Jantar",
        time: "20:00",
        calories: 340,
        observations: "Proteína de digestão lenta para recuperação noturna.",
        foods: [
          {
            id: "14-r5-f1",
            name: "Salmão grelhado",
            quantity: 1, unit: "filé grande", grams: 180, calories: 300,
            macros: { cho: 0, ptn: 41, lip: 14 },
            substitutions: [
              { id: "s14-13", name: "Frango assado + azeite", quantity: 1, unit: "filé grande", grams: 150, calories: 257, macros: { cho: 0, ptn: 40, lip: 11 }, note: null, restriction: null },
              { id: "s14-14", name: "Omelete de 4 ovos + queijo", quantity: 1, unit: "porção", grams: 200, calories: 330, macros: { cho: 1, ptn: 28, lip: 23 }, note: null, restriction: null }
            ]
          },
          {
            id: "14-r5-f2",
            name: "Legumes variados refogados",
            quantity: 1, unit: "xícara", grams: 150, calories: 55,
            macros: { cho: 10, ptn: 3, lip: 1 },
            substitutions: [
              { id: "s14-15", name: "Salada + brócolis grelhado", quantity: 1, unit: "prato", grams: 150, calories: 50, macros: { cho: 8, ptn: 4, lip: 1 }, note: null, restriction: null },
              { id: "s14-16", name: "Espinafre refogado + cenoura", quantity: 1, unit: "xícara", grams: 130, calories: 55, macros: { cho: 7, ptn: 4, lip: 2 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },

  // ── PLANO 15 ─────────────────────────────────────────────────────────────
  {
    id: 15,
    slug: "hipoglicemico-1800kcal",
    name: "Hipoglicêmico 1800 kcal",
    objective: "manutencao",
    totalCalories: 1800,
    macros: { protein: 90, carbs: 203, fat: 60 },
    mealsPerDay: 6,
    restrictions: [],
    tags: ["hipoglicemia", "baixo IG", "6 refeições", "glicemia"],
    badgeLabel: "Hipoglicêmico",
    badgeColor: "yellow",
    clinicalNotes: "Plano para hipoglicemia reativa ou funcional. Refeições a cada 2–3h para manter glicemia estável. Evitar açúcares simples e períodos de jejum.",
    contraindications: "Monitorar glicemia antes e após refeições nos primeiros 15 dias.",
    patientInstructions: "Nunca fique mais de 3 horas sem comer. Sempre combine CHO + PTN em cada refeição. Tenha sempre uma barra de cereal ou fruta na bolsa.",
    meals: [
      {
        id: "15-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 320,
        observations: "CHO de baixo IG + proteína para estabilidade glicêmica.",
        foods: [
          {
            id: "15-r1-f1",
            name: "Aveia em flocos",
            quantity: 4, unit: "colher de sopa", grams: 40, calories: 148,
            macros: { cho: 26, ptn: 5, lip: 3 },
            substitutions: [
              { id: "s15-1", name: "Pão integral", quantity: 2, unit: "fatia", grams: 60, calories: 156, macros: { cho: 28, ptn: 6, lip: 2 }, note: null, restriction: null },
              { id: "s15-2", name: "Quinoa em flocos", quantity: 3, unit: "colher de sopa", grams: 30, calories: 108, macros: { cho: 20, ptn: 4, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "15-r1-f2",
            name: "Ovos mexidos (2 un)",
            quantity: 2, unit: "unidade", grams: 100, calories: 144,
            macros: { cho: 1, ptn: 13, lip: 10 },
            substitutions: [
              { id: "s15-3", name: "Iogurte grego desnatado", quantity: 1, unit: "pote (170g)", grams: 170, calories: 97, macros: { cho: 7, ptn: 17, lip: 0 }, note: null, restriction: null },
              { id: "s15-4", name: "Queijo cottage", quantity: 4, unit: "colher de sopa", grams: 80, calories: 72, macros: { cho: 3, ptn: 12, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "15-ref2",
        name: "Lanche manhã 1",
        time: "09:30",
        calories: 190,
        observations: "Não pular este lanche.",
        foods: [
          {
            id: "15-r2-f1",
            name: "Maçã",
            quantity: 1, unit: "unidade", grams: 130, calories: 68,
            macros: { cho: 17, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s15-5", name: "Pera", quantity: 1, unit: "unidade", grams: 130, calories: 65, macros: { cho: 16, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s15-6", name: "Kiwi (2 un)", quantity: 2, unit: "unidade", grams: 130, calories: 78, macros: { cho: 18, ptn: 2, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "15-r2-f2",
            name: "Castanha-do-pará (3 un)",
            quantity: 3, unit: "unidade", grams: 12, calories: 82,
            macros: { cho: 1, ptn: 2, lip: 8 },
            substitutions: [
              { id: "s15-7", name: "Amendoim sem sal", quantity: 1, unit: "colher de sopa", grams: 12, calories: 68, macros: { cho: 2, ptn: 3, lip: 6 }, note: null, restriction: null },
              { id: "s15-8", name: "Queijo minas frescal", quantity: 1, unit: "fatia média", grams: 30, calories: 57, macros: { cho: 1, ptn: 4, lip: 4 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "15-ref3",
        name: "Almoço",
        time: "12:00",
        calories: 490,
        observations: "Inclua fibras (salada) no início da refeição para retardar absorção de CHO.",
        foods: [
          {
            id: "15-r3-f1",
            name: "Arroz integral cozido",
            quantity: 5, unit: "colher de sopa", grams: 100, calories: 140,
            macros: { cho: 29, ptn: 3, lip: 1 },
            substitutions: [
              { id: "s15-9", name: "Batata-doce cozida", quantity: 1, unit: "unidade pequena", grams: 100, calories: 100, macros: { cho: 23, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s15-10", name: "Quinoa cozida", quantity: 4, unit: "colher de sopa", grams: 80, calories: 108, macros: { cho: 18, ptn: 5, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "15-r3-f2",
            name: "Feijão-carioca cozido",
            quantity: 2, unit: "concha", grams: 100, calories: 120,
            macros: { cho: 22, ptn: 8, lip: 1 },
            substitutions: [
              { id: "s15-11", name: "Lentilha cozida", quantity: 4, unit: "colher de sopa", grams: 80, calories: 92, macros: { cho: 16, ptn: 6, lip: 0 }, note: null, restriction: null },
              { id: "s15-12", name: "Ervilha fresca cozida", quantity: 4, unit: "colher de sopa", grams: 80, calories: 66, macros: { cho: 12, ptn: 5, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "15-r3-f3",
            name: "Peito de frango grelhado",
            quantity: 1, unit: "filé médio", grams: 120, calories: 156,
            macros: { cho: 0, ptn: 32, lip: 3 },
            substitutions: [
              { id: "s15-13", name: "Tilápia assada", quantity: 1, unit: "filé médio", grams: 120, calories: 132, macros: { cho: 0, ptn: 27, lip: 2 }, note: null, restriction: null },
              { id: "s15-14", name: "Atum em água", quantity: 1, unit: "lata", grams: 120, calories: 132, macros: { cho: 0, ptn: 28, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "15-r3-f4",
            name: "Salada crua (alface + tomate + pepino)",
            quantity: 1, unit: "prato raso", grams: 120, calories: 30,
            macros: { cho: 5, ptn: 2, lip: 0 },
            substitutions: [
              { id: "s15-15", name: "Brócolis + cenoura", quantity: 1, unit: "porção", grams: 100, calories: 44, macros: { cho: 8, ptn: 3, lip: 0 }, note: null, restriction: null },
              { id: "s15-16", name: "Rúcula + rabanete", quantity: 1, unit: "prato raso", grams: 100, calories: 22, macros: { cho: 4, ptn: 2, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "15-ref4",
        name: "Lanche da tarde",
        time: "15:00",
        calories: 200,
        observations: "3 horas após o almoço.",
        foods: [
          {
            id: "15-r4-f1",
            name: "Iogurte natural + granola light",
            quantity: 1, unit: "pote + 2 col", grams: 130, calories: 145,
            macros: { cho: 20, ptn: 7, lip: 3 },
            substitutions: [
              { id: "s15-17", name: "Queijo cottage + mel + nozes", quantity: 1, unit: "tigela", grams: 100, calories: 135, macros: { cho: 10, ptn: 12, lip: 6 }, note: null, restriction: null },
              { id: "s15-18", name: "Vitamina de banana com leite", quantity: 1, unit: "copo (200ml)", grams: 250, calories: 180, macros: { cho: 34, ptn: 8, lip: 2 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "15-ref5",
        name: "Jantar",
        time: "19:00",
        calories: 380,
        observations: null,
        foods: [
          {
            id: "15-r5-f1",
            name: "Macarrão integral cozido",
            quantity: 1, unit: "xícara", grams: 100, calories: 140,
            macros: { cho: 27, ptn: 5, lip: 1 },
            substitutions: [
              { id: "s15-19", name: "Arroz integral", quantity: 4, unit: "colher de sopa", grams: 80, calories: 112, macros: { cho: 23, ptn: 2, lip: 1 }, note: null, restriction: null },
              { id: "s15-20", name: "Batata cozida", quantity: 2, unit: "unidade", grams: 200, calories: 154, macros: { cho: 35, ptn: 4, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "15-r5-f2",
            name: "Salmão grelhado",
            quantity: 1, unit: "filé médio", grams: 150, calories: 250,
            macros: { cho: 0, ptn: 34, lip: 12 },
            substitutions: [
              { id: "s15-21", name: "Frango assado", quantity: 1, unit: "filé grande", grams: 150, calories: 195, macros: { cho: 0, ptn: 40, lip: 4 }, note: null, restriction: null },
              { id: "s15-22", name: "Omelete de 3 ovos", quantity: 1, unit: "unidade", grams: 150, calories: 216, macros: { cho: 1, ptn: 19, lip: 15 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "15-ref6",
        name: "Ceia",
        time: "22:00",
        calories: 220,
        observations: "Obrigatória para evitar hipoglicemia noturna.",
        foods: [
          {
            id: "15-r6-f1",
            name: "Iogurte grego",
            quantity: 1, unit: "pote (200g)", grams: 200, calories: 114,
            macros: { cho: 8, ptn: 20, lip: 4 },
            substitutions: [
              { id: "s15-23", name: "Queijo cottage + torrada", quantity: 1, unit: "porção", grams: 90, calories: 126, macros: { cho: 15, ptn: 14, lip: 2 }, note: null, restriction: null },
              { id: "s15-24", name: "Leite integral morno", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 122, macros: { cho: 10, ptn: 6, lip: 7 }, note: null, restriction: null }
            ]
          },
          {
            id: "15-r6-f2",
            name: "Castanhas mistas",
            quantity: 1, unit: "punhado (15g)", grams: 15, calories: 90,
            macros: { cho: 3, ptn: 2, lip: 8 },
            substitutions: [
              { id: "s15-25", name: "Amendoim torrado", quantity: 1, unit: "colher de sopa", grams: 12, calories: 68, macros: { cho: 2, ptn: 3, lip: 6 }, note: null, restriction: null },
              { id: "s15-26", name: "Pasta de amendoim (1 col chá)", quantity: 1, unit: "colher de chá", grams: 8, calories: 48, macros: { cho: 2, ptn: 2, lip: 4 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  }
,

  // ── PLANO 16 ─────────────────────────────────────────────────────────────
  {
    id: 16,
    slug: "hipoproteico-1800kcal",
    name: "Hipoproteico 1800 kcal",
    objective: "manutencao",
    totalCalories: 1800,
    macros: { protein: 45, carbs: 293, fat: 50 },
    mealsPerDay: 5,
    restrictions: [],
    tags: ["hipoproteico", "doença renal", "hemodiálise", "baixa proteína"],
    badgeLabel: "Hipoproteico",
    badgeColor: "gray",
    clinicalNotes: "Indicado para DRC estágio 3–4 (pré-diálise). Proteína 0,6–0,8g/kg/dia. Restrição de potássio e fósforo conforme exames.",
    contraindications: "Não usar em pacientes em hemodiálise (necessitam de mais proteína). Monitorar albumina e peso semanalmente.",
    patientInstructions: "Evite carnes processadas, laticínios em excesso e alimentos ricos em fósforo (chocolate, refrigerante escuro, amendoim).",
    meals: [
      {
        id: "16-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 360,
        observations: "Priorizar CHO e gordura saudável. Limitar proteína.",
        foods: [
          {
            id: "16-r1-f1",
            name: "Pão branco",
            quantity: 3, unit: "fatia", grams: 90, calories: 243,
            macros: { cho: 48, ptn: 8, lip: 2 },
            substitutions: [
              { id: "s16-1", name: "Tapioca (2 un)", quantity: 2, unit: "unidade", grams: 80, calories: 272, macros: { cho: 64, ptn: 2, lip: 0 }, note: "Baixa proteína", restriction: null },
              { id: "s16-2", name: "Cuscuz de milho", quantity: 4, unit: "colher de sopa", grams: 80, calories: 224, macros: { cho: 46, ptn: 4, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "16-r1-f2",
            name: "Mel",
            quantity: 2, unit: "colher de sopa", grams: 40, calories: 120,
            macros: { cho: 33, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s16-3", name: "Geleia de frutas vermelhas", quantity: 2, unit: "colher de sopa", grams: 40, calories: 100, macros: { cho: 25, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s16-4", name: "Açúcar refinado", quantity: 2, unit: "colher de chá", grams: 8, calories: 31, macros: { cho: 8, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "16-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 200,
        observations: null,
        foods: [
          {
            id: "16-r2-f1",
            name: "Biscoito doce (maisena)",
            quantity: 6, unit: "unidade", grams: 36, calories: 162,
            macros: { cho: 27, ptn: 2, lip: 5 },
            substitutions: [
              { id: "s16-5", name: "Biscoito de arroz", quantity: 4, unit: "unidade", grams: 28, calories: 112, macros: { cho: 24, ptn: 2, lip: 1 }, note: null, restriction: null },
              { id: "s16-6", name: "Wafer de baunilha (sem recheio cremoso)", quantity: 4, unit: "unidade", grams: 28, calories: 130, macros: { cho: 22, ptn: 1, lip: 4 }, note: null, restriction: null }
            ]
          },
          {
            id: "16-r2-f2",
            name: "Suco de maçã natural",
            quantity: 1, unit: "copo (200ml)", grams: 200, calories: 94,
            macros: { cho: 23, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s16-7", name: "Suco de uva integral", quantity: 1, unit: "copo (150ml)", grams: 150, calories: 105, macros: { cho: 26, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s16-8", name: "Limonada sem açúcar", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 15, macros: { cho: 4, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "16-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 540,
        observations: "Proteína em quantidade controlada. Valorize CHO e gorduras.",
        foods: [
          {
            id: "16-r3-f1",
            name: "Arroz branco cozido",
            quantity: 8, unit: "colher de sopa", grams: 160, calories: 218,
            macros: { cho: 48, ptn: 4, lip: 0 },
            substitutions: [
              { id: "s16-9", name: "Macarrão branco cozido", quantity: 2, unit: "xícara", grams: 200, calories: 280, macros: { cho: 56, ptn: 10, lip: 1 }, note: null, restriction: null },
              { id: "s16-10", name: "Polenta cozida", quantity: 4, unit: "colher de sopa", grams: 120, calories: 150, macros: { cho: 33, ptn: 3, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "16-r3-f2",
            name: "Clara de ovo cozida (2 un)",
            quantity: 2, unit: "unidade", grams: 66, calories: 34,
            macros: { cho: 1, ptn: 7, lip: 0 },
            substitutions: [
              { id: "s16-11", name: "Peito de frango (porção pequena)", quantity: 1, unit: "porção (60g)", grams: 60, calories: 78, macros: { cho: 0, ptn: 16, lip: 1 }, note: null, restriction: null },
              { id: "s16-12", name: "Atum em água (porção pequena)", quantity: 1, unit: "porção (50g)", grams: 50, calories: 55, macros: { cho: 0, ptn: 12, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "16-r3-f3",
            name: "Legumes refogados em azeite",
            quantity: 1, unit: "xícara", grams: 150, calories: 110,
            macros: { cho: 12, ptn: 3, lip: 6 },
            substitutions: [
              { id: "s16-13", name: "Cenoura + chuchu cozidos", quantity: 1, unit: "xícara", grams: 150, calories: 65, macros: { cho: 14, ptn: 2, lip: 0 }, note: null, restriction: null },
              { id: "s16-14", name: "Abobrinha + pimentão refogados", quantity: 1, unit: "xícara", grams: 150, calories: 90, macros: { cho: 10, ptn: 2, lip: 5 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "16-ref4",
        name: "Lanche da tarde",
        time: "15:30",
        calories: 270,
        observations: null,
        foods: [
          {
            id: "16-r4-f1",
            name: "Vitamina de banana com leite de arroz",
            quantity: 1, unit: "copo (300ml)", grams: 300, calories: 200,
            macros: { cho: 44, ptn: 3, lip: 2 },
            substitutions: [
              { id: "s16-15", name: "Suco de frutas natural", quantity: 1, unit: "copo (300ml)", grams: 300, calories: 150, macros: { cho: 36, ptn: 2, lip: 0 }, note: null, restriction: null },
              { id: "s16-16", name: "Vitamina de mamão", quantity: 1, unit: "copo (250ml)", grams: 250, calories: 160, macros: { cho: 38, ptn: 2, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "16-r4-f2",
            name: "Biscoito água e sal",
            quantity: 4, unit: "unidade", grams: 20, calories: 84,
            macros: { cho: 14, ptn: 1, lip: 3 },
            substitutions: [
              { id: "s16-17", name: "Torrada branca", quantity: 2, unit: "unidade", grams: 20, calories: 80, macros: { cho: 16, ptn: 2, lip: 1 }, note: null, restriction: null },
              { id: "s16-18", name: "Biscoito de arroz", quantity: 3, unit: "unidade", grams: 21, calories: 84, macros: { cho: 18, ptn: 2, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "16-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 430,
        observations: null,
        foods: [
          {
            id: "16-r5-f1",
            name: "Macarrão branco com molho de tomate",
            quantity: 2, unit: "xícara + molho", grams: 260, calories: 316,
            macros: { cho: 63, ptn: 10, lip: 2 },
            substitutions: [
              { id: "s16-19", name: "Arroz branco + azeite", quantity: 8, unit: "colher + fio azeite", grams: 173, calories: 280, macros: { cho: 48, ptn: 4, lip: 7 }, note: null, restriction: null },
              { id: "s16-20", name: "Nhoque de batata (sem queijo)", quantity: 1, unit: "porção (200g)", grams: 200, calories: 280, macros: { cho: 54, ptn: 7, lip: 4 }, note: null, restriction: null }
            ]
          },
          {
            id: "16-r5-f2",
            name: "Azeite de oliva",
            quantity: 1, unit: "colher de sopa", grams: 13, calories: 115,
            macros: { cho: 0, ptn: 0, lip: 13 },
            substitutions: [
              { id: "s16-21", name: "Manteiga sem sal", quantity: 1, unit: "colher de sopa", grams: 13, calories: 93, macros: { cho: 0, ptn: 0, lip: 10 }, note: null, restriction: null },
              { id: "s16-22", name: "Óleo de canola", quantity: 1, unit: "colher de sopa", grams: 13, calories: 115, macros: { cho: 0, ptn: 0, lip: 13 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },

  // ── PLANO 17 ─────────────────────────────────────────────────────────────
  {
    id: 17,
    slug: "dieta-liquida-1000kcal",
    name: "Dieta Líquida 1000 kcal",
    objective: "manutencao",
    totalCalories: 1000,
    macros: { protein: 30, carbs: 150, fat: 22 },
    mealsPerDay: 6,
    restrictions: [],
    tags: ["dieta líquida", "pós-cirurgia", "disfagia", "hospitalar"],
    badgeLabel: "Dieta Líquida",
    badgeColor: "gray",
    clinicalNotes: "Dieta líquida completa. Indicada no pós-operatório imediato, disfagia grave e procedimentos odontológicos. Todos os alimentos devem ter consistência líquida.",
    contraindications: "Usar apenas por curto período (máximo 5–7 dias). Suplementar vitaminas e minerais conforme necessidade.",
    patientInstructions: "Todos os alimentos devem passar por peneira fina ou liquidificador. Temperatura morna ou fria — nunca muito quente.",
    meals: [
      {
        id: "17-ref1",
        name: "Desjejum",
        time: "07:00",
        calories: 180,
        observations: "Líquidos finos ou coados.",
        foods: [
          {
            id: "17-r1-f1",
            name: "Mingau de aveia coado",
            quantity: 1, unit: "copo (250ml)", grams: 250, calories: 148,
            macros: { cho: 26, ptn: 4, lip: 3 },
            substitutions: [
              { id: "s17-1", name: "Vitamina de banana com leite desnatado", quantity: 1, unit: "copo (250ml)", grams: 250, calories: 160, macros: { cho: 30, ptn: 7, lip: 1 }, note: null, restriction: null },
              { id: "s17-2", name: "Suco de fruta coado", quantity: 1, unit: "copo (250ml)", grams: 250, calories: 90, macros: { cho: 22, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "17-r1-f2",
            name: "Chá de camomila sem açúcar",
            quantity: 1, unit: "xícara (150ml)", grams: 150, calories: 2,
            macros: { cho: 0, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s17-3", name: "Água de coco", quantity: 1, unit: "copo (150ml)", grams: 150, calories: 33, macros: { cho: 8, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s17-4", name: "Chá verde sem açúcar", quantity: 1, unit: "xícara (150ml)", grams: 150, calories: 2, macros: { cho: 0, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "17-ref2",
        name: "Lanche 1",
        time: "09:30",
        calories: 120,
        observations: null,
        foods: [
          {
            id: "17-r2-f1",
            name: "Suco de laranja coado",
            quantity: 1, unit: "copo (200ml)", grams: 200, calories: 88,
            macros: { cho: 21, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s17-5", name: "Suco de maçã sem açúcar", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 92, macros: { cho: 23, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s17-6", name: "Água de coco", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 44, macros: { cho: 10, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "17-r2-f2",
            name: "Gelatina diet",
            quantity: 1, unit: "pote (100g)", grams: 100, calories: 10,
            macros: { cho: 2, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s17-7", name: "Gelatina comum", quantity: 1, unit: "pote (100g)", grams: 100, calories: 70, macros: { cho: 17, ptn: 2, lip: 0 }, note: null, restriction: null },
              { id: "s17-8", name: "Caldo de legumes coado", quantity: 1, unit: "xícara (150ml)", grams: 150, calories: 20, macros: { cho: 4, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "17-ref3",
        name: "Almoço",
        time: "12:00",
        calories: 210,
        observations: "Tudo coado e sem grumos.",
        foods: [
          {
            id: "17-r3-f1",
            name: "Caldo de galinha coado",
            quantity: 1, unit: "tigela (300ml)", grams: 300, calories: 120,
            macros: { cho: 6, ptn: 10, lip: 6 },
            substitutions: [
              { id: "s17-9", name: "Caldo de legumes coado", quantity: 1, unit: "tigela (300ml)", grams: 300, calories: 60, macros: { cho: 12, ptn: 2, lip: 1 }, note: null, restriction: null },
              { id: "s17-10", name: "Sopa creme de abóbora coada", quantity: 1, unit: "tigela (300ml)", grams: 300, calories: 120, macros: { cho: 22, ptn: 2, lip: 3 }, note: null, restriction: null }
            ]
          },
          {
            id: "17-r3-f2",
            name: "Suco de fruta natural coado",
            quantity: 1, unit: "copo (200ml)", grams: 200, calories: 80,
            macros: { cho: 20, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s17-11", name: "Água de coco", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 44, macros: { cho: 10, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s17-12", name: "Chá de ervas adoçado", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 40, macros: { cho: 10, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "17-ref4",
        name: "Lanche 2",
        time: "15:00",
        calories: 130,
        observations: null,
        foods: [
          {
            id: "17-r4-f1",
            name: "Leite desnatado com mel",
            quantity: 1, unit: "copo (200ml)", grams: 207, calories: 108,
            macros: { cho: 18, ptn: 7, lip: 0 },
            substitutions: [
              { id: "s17-13", name: "Leite de amêndoas com mel", quantity: 1, unit: "copo (200ml)", grams: 207, calories: 70, macros: { cho: 12, ptn: 1, lip: 3 }, note: null, restriction: null },
              { id: "s17-14", name: "Iogurte líquido desnatado", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 110, macros: { cho: 15, ptn: 8, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "17-ref5",
        name: "Jantar",
        time: "19:00",
        calories: 200,
        observations: "Caldo coado, quente mas não fervente.",
        foods: [
          {
            id: "17-r5-f1",
            name: "Sopa creme de legumes coada",
            quantity: 1, unit: "tigela (350ml)", grams: 350, calories: 140,
            macros: { cho: 22, ptn: 5, lip: 4 },
            substitutions: [
              { id: "s17-15", name: "Caldo de carne coado", quantity: 1, unit: "tigela (350ml)", grams: 350, calories: 120, macros: { cho: 5, ptn: 12, lip: 5 }, note: null, restriction: null },
              { id: "s17-16", name: "Creme de mandioquinha coado", quantity: 1, unit: "tigela (300ml)", grams: 300, calories: 165, macros: { cho: 30, ptn: 3, lip: 4 }, note: null, restriction: null }
            ]
          },
          {
            id: "17-r5-f2",
            name: "Gelatina de frutas",
            quantity: 1, unit: "pote (100g)", grams: 100, calories: 70,
            macros: { cho: 17, ptn: 2, lip: 0 },
            substitutions: [
              { id: "s17-17", name: "Gelatina diet", quantity: 1, unit: "pote (100g)", grams: 100, calories: 10, macros: { cho: 2, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s17-18", name: "Pudim de leite desnatado", quantity: 1, unit: "pote (80g)", grams: 80, calories: 80, macros: { cho: 15, ptn: 3, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "17-ref6",
        name: "Ceia",
        time: "21:30",
        calories: 160,
        observations: null,
        foods: [
          {
            id: "17-r6-f1",
            name: "Iogurte líquido sem pedaços",
            quantity: 1, unit: "copo (200ml)", grams: 200, calories: 110,
            macros: { cho: 15, ptn: 8, lip: 1 },
            substitutions: [
              { id: "s17-19", name: "Vitamina de mamão com leite", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 130, macros: { cho: 24, ptn: 6, lip: 1 }, note: null, restriction: null },
              { id: "s17-20", name: "Leite morno com canela", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 122, macros: { cho: 10, ptn: 6, lip: 7 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },

  // ── PLANO 18 ─────────────────────────────────────────────────────────────
  {
    id: 18,
    slug: "dieta-liquida-1200kcal",
    name: "Dieta Líquida 1200 kcal",
    objective: "manutencao",
    totalCalories: 1200,
    macros: { protein: 38, carbs: 180, fat: 27 },
    mealsPerDay: 6,
    restrictions: [],
    tags: ["dieta líquida", "pós-cirurgia", "disfagia moderada"],
    badgeLabel: "Dieta Líquida",
    badgeColor: "gray",
    clinicalNotes: "Transição de dieta líquida restrita para líquida completa. Inclui preparações mais calóricas e proteicas.",
    contraindications: "Avaliar tolerância individual. Progredir para pastosa quando clinicamente indicado.",
    patientInstructions: "Consuma devagar, em pequenos goles. Evite líquidos muito frios ou muito quentes.",
    meals: [
      {
        id: "18-ref1",
        name: "Desjejum",
        time: "07:00",
        calories: 220,
        observations: null,
        foods: [
          {
            id: "18-r1-f1",
            name: "Vitamina de banana + leite desnatado + aveia",
            quantity: 1, unit: "copo (300ml)", grams: 300, calories: 220,
            macros: { cho: 40, ptn: 9, lip: 2 },
            substitutions: [
              { id: "s18-1", name: "Shake de whey + leite desnatado", quantity: 1, unit: "copo (300ml)", grams: 300, calories: 230, macros: { cho: 20, ptn: 28, lip: 3 }, note: null, restriction: null },
              { id: "s18-2", name: "Mingau de aveia com leite integral", quantity: 1, unit: "copo (300ml)", grams: 300, calories: 250, macros: { cho: 38, ptn: 9, lip: 6 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "18-ref2",
        name: "Lanche 1",
        time: "09:30",
        calories: 150,
        observations: null,
        foods: [
          {
            id: "18-r2-f1",
            name: "Iogurte líquido desnatado",
            quantity: 1, unit: "copo (200ml)", grams: 200, calories: 110,
            macros: { cho: 15, ptn: 8, lip: 1 },
            substitutions: [
              { id: "s18-3", name: "Leite com mel", quantity: 1, unit: "copo (200ml)", grams: 207, calories: 130, macros: { cho: 19, ptn: 6, lip: 3 }, note: null, restriction: null },
              { id: "s18-4", name: "Suco de laranja + leite em pó", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 120, macros: { cho: 22, ptn: 4, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "18-ref3",
        name: "Almoço",
        time: "12:00",
        calories: 280,
        observations: "Sopas cremosas coadas.",
        foods: [
          {
            id: "18-r3-f1",
            name: "Creme de legumes com frango desfiado coado",
            quantity: 1, unit: "tigela (350ml)", grams: 350, calories: 200,
            macros: { cho: 22, ptn: 14, lip: 6 },
            substitutions: [
              { id: "s18-5", name: "Sopa creme de abóbora + leite", quantity: 1, unit: "tigela (350ml)", grams: 350, calories: 180, macros: { cho: 28, ptn: 5, lip: 5 }, note: null, restriction: null },
              { id: "s18-6", name: "Creme de mandioquinha com caldo de galinha", quantity: 1, unit: "tigela (350ml)", grams: 350, calories: 200, macros: { cho: 34, ptn: 7, lip: 4 }, note: null, restriction: null }
            ]
          },
          {
            id: "18-r3-f2",
            name: "Suco natural coado",
            quantity: 1, unit: "copo (200ml)", grams: 200, calories: 80,
            macros: { cho: 20, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s18-7", name: "Água de coco", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 44, macros: { cho: 10, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s18-8", name: "Limonada com mel", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 60, macros: { cho: 16, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "18-ref4",
        name: "Lanche 2",
        time: "15:00",
        calories: 170,
        observations: null,
        foods: [
          {
            id: "18-r4-f1",
            name: "Leite integral com achocolatado",
            quantity: 1, unit: "copo (200ml)", grams: 200, calories: 172,
            macros: { cho: 26, ptn: 7, lip: 5 },
            substitutions: [
              { id: "s18-9", name: "Leite desnatado + mel + canela", quantity: 1, unit: "copo (200ml)", grams: 207, calories: 110, macros: { cho: 17, ptn: 7, lip: 0 }, note: null, restriction: null },
              { id: "s18-10", name: "Vitamina de mamão + leite", quantity: 1, unit: "copo (200ml)", grams: 250, calories: 140, macros: { cho: 26, ptn: 6, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "18-ref5",
        name: "Jantar",
        time: "19:00",
        calories: 240,
        observations: null,
        foods: [
          {
            id: "18-r5-f1",
            name: "Caldo de carne com legumes coado",
            quantity: 1, unit: "tigela (350ml)", grams: 350, calories: 160,
            macros: { cho: 12, ptn: 14, lip: 6 },
            substitutions: [
              { id: "s18-11", name: "Creme de batata com frango", quantity: 1, unit: "tigela (350ml)", grams: 350, calories: 210, macros: { cho: 30, ptn: 12, lip: 5 }, note: null, restriction: null },
              { id: "s18-12", name: "Sopa creme de ervilha coada", quantity: 1, unit: "tigela (350ml)", grams: 350, calories: 175, macros: { cho: 28, ptn: 8, lip: 3 }, note: null, restriction: null }
            ]
          },
          {
            id: "18-r5-f2",
            name: "Gelatina de frutas",
            quantity: 1, unit: "pote (100g)", grams: 100, calories: 70,
            macros: { cho: 17, ptn: 2, lip: 0 },
            substitutions: [
              { id: "s18-13", name: "Gelatina diet", quantity: 1, unit: "pote (100g)", grams: 100, calories: 10, macros: { cho: 2, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s18-14", name: "Pudim de leite desnatado", quantity: 1, unit: "pote (80g)", grams: 80, calories: 80, macros: { cho: 15, ptn: 3, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "18-ref6",
        name: "Ceia",
        time: "21:30",
        calories: 140,
        observations: null,
        foods: [
          {
            id: "18-r6-f1",
            name: "Leite morno com mel",
            quantity: 1, unit: "copo (200ml)", grams: 207, calories: 140,
            macros: { cho: 19, ptn: 7, lip: 4 },
            substitutions: [
              { id: "s18-15", name: "Iogurte líquido natural", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 110, macros: { cho: 15, ptn: 8, lip: 1 }, note: null, restriction: null },
              { id: "s18-16", name: "Vitamina de banana light", quantity: 1, unit: "copo (200ml)", grams: 250, calories: 120, macros: { cho: 24, ptn: 5, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },

  // ── PLANO 19 ─────────────────────────────────────────────────────────────
  {
    id: 19,
    slug: "dieta-liquida-1500kcal",
    name: "Dieta Líquida 1500 kcal",
    objective: "manutencao",
    totalCalories: 1500,
    macros: { protein: 60, carbs: 225, fat: 33 },
    mealsPerDay: 6,
    restrictions: [],
    tags: ["dieta líquida", "disfagia leve", "pós-operatório tardio"],
    badgeLabel: "Dieta Líquida",
    badgeColor: "gray",
    clinicalNotes: "Dieta líquida com maior densidade calórica. Para disfagia leve ou fase de transição antes da dieta pastosa.",
    contraindications: "Progredir para pastosa conforme orientação médica/fonoaudiológica.",
    patientInstructions: "Pode incluir preparações mais consistentes, mas sempre coadas ou batidas. Sem pedaços.",
    meals: [
      {
        id: "19-ref1",
        name: "Desjejum",
        time: "07:00",
        calories: 280,
        observations: null,
        foods: [
          {
            id: "19-r1-f1",
            name: "Vitamina reforçada (banana + leite integral + aveia + mel)",
            quantity: 1, unit: "copo (350ml)", grams: 350, calories: 280,
            macros: { cho: 48, ptn: 10, lip: 6 },
            substitutions: [
              { id: "s19-1", name: "Shake proteico + leite + banana", quantity: 1, unit: "copo (350ml)", grams: 350, calories: 300, macros: { cho: 38, ptn: 28, lip: 5 }, note: null, restriction: null },
              { id: "s19-2", name: "Mingau enriquecido de aveia", quantity: 1, unit: "copo (350ml)", grams: 350, calories: 270, macros: { cho: 44, ptn: 10, lip: 6 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "19-ref2",
        name: "Lanche 1",
        time: "09:30",
        calories: 200,
        observations: null,
        foods: [
          {
            id: "19-r2-f1",
            name: "Iogurte grego batido + mel",
            quantity: 1, unit: "pote (200g)", grams: 207, calories: 170,
            macros: { cho: 14, ptn: 20, lip: 4 },
            substitutions: [
              { id: "s19-3", name: "Vitamina de frutas + leite", quantity: 1, unit: "copo (250ml)", grams: 250, calories: 180, macros: { cho: 34, ptn: 6, lip: 2 }, note: null, restriction: null },
              { id: "s19-4", name: "Leite fermentado batido", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 150, macros: { cho: 20, ptn: 7, lip: 4 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "19-ref3",
        name: "Almoço",
        time: "12:00",
        calories: 350,
        observations: "Sopas densas e cremosas.",
        foods: [
          {
            id: "19-r3-f1",
            name: "Creme de frango com legumes + creme de leite",
            quantity: 1, unit: "tigela (400ml)", grams: 400, calories: 280,
            macros: { cho: 24, ptn: 20, lip: 12 },
            substitutions: [
              { id: "s19-5", name: "Sopa grossa de lentilha batida", quantity: 1, unit: "tigela (400ml)", grams: 400, calories: 260, macros: { cho: 38, ptn: 14, lip: 5 }, note: null, restriction: null },
              { id: "s19-6", name: "Creme de ervilha com presunto batido", quantity: 1, unit: "tigela (400ml)", grams: 400, calories: 290, macros: { cho: 32, ptn: 18, lip: 8 }, note: null, restriction: null }
            ]
          },
          {
            id: "19-r3-f2",
            name: "Suco natural",
            quantity: 1, unit: "copo (200ml)", grams: 200, calories: 80,
            macros: { cho: 20, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s19-7", name: "Água de coco", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 44, macros: { cho: 10, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s19-8", name: "Limonada com mel", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 60, macros: { cho: 16, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "19-ref4",
        name: "Lanche 2",
        time: "15:00",
        calories: 230,
        observations: null,
        foods: [
          {
            id: "19-r4-f1",
            name: "Leite integral batido com frutas + proteína",
            quantity: 1, unit: "copo (300ml)", grams: 300, calories: 230,
            macros: { cho: 30, ptn: 15, lip: 6 },
            substitutions: [
              { id: "s19-9", name: "Vitamina de abacate + leite", quantity: 1, unit: "copo (300ml)", grams: 300, calories: 280, macros: { cho: 22, ptn: 7, lip: 15 }, note: null, restriction: null },
              { id: "s19-10", name: "Iogurte grego + suco de frutas batido", quantity: 1, unit: "copo (300ml)", grams: 300, calories: 200, macros: { cho: 28, ptn: 14, lip: 3 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "19-ref5",
        name: "Jantar",
        time: "19:00",
        calories: 300,
        observations: null,
        foods: [
          {
            id: "19-r5-f1",
            name: "Sopa creme de carne batida e coada",
            quantity: 1, unit: "tigela (400ml)", grams: 400, calories: 220,
            macros: { cho: 20, ptn: 18, lip: 8 },
            substitutions: [
              { id: "s19-11", name: "Creme de batata + frango batido", quantity: 1, unit: "tigela (400ml)", grams: 400, calories: 250, macros: { cho: 34, ptn: 14, lip: 6 }, note: null, restriction: null },
              { id: "s19-12", name: "Sopa de peixe cremosa batida", quantity: 1, unit: "tigela (400ml)", grams: 400, calories: 200, macros: { cho: 18, ptn: 20, lip: 5 }, note: null, restriction: null }
            ]
          },
          {
            id: "19-r5-f2",
            name: "Pudim de leite desnatado",
            quantity: 1, unit: "pote (150g)", grams: 150, calories: 150,
            macros: { cho: 28, ptn: 5, lip: 2 },
            substitutions: [
              { id: "s19-13", name: "Mousse de maracujá light", quantity: 1, unit: "pote (120g)", grams: 120, calories: 100, macros: { cho: 18, ptn: 4, lip: 2 }, note: null, restriction: null },
              { id: "s19-14", name: "Gelatina de leite condensado", quantity: 1, unit: "pote (150g)", grams: 150, calories: 140, macros: { cho: 26, ptn: 4, lip: 2 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "19-ref6",
        name: "Ceia",
        time: "21:30",
        calories: 140,
        observations: null,
        foods: [
          {
            id: "19-r6-f1",
            name: "Leite integral morno com mel e canela",
            quantity: 1, unit: "copo (200ml)", grams: 207, calories: 140,
            macros: { cho: 19, ptn: 7, lip: 4 },
            substitutions: [
              { id: "s19-15", name: "Iogurte líquido integral", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 130, macros: { cho: 18, ptn: 7, lip: 3 }, note: null, restriction: null },
              { id: "s19-16", name: "Vitamina de banana light batida", quantity: 1, unit: "copo (200ml)", grams: 250, calories: 140, macros: { cho: 26, ptn: 6, lip: 2 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },

  // ── PLANO 20 ─────────────────────────────────────────────────────────────
  {
    id: 20,
    slug: "ovo-lacto-vegetariano-1800kcal",
    name: "Ovo-Lacto-Vegetariano 1800 kcal",
    objective: "vegetariano",
    totalCalories: 1800,
    macros: { protein: 90, carbs: 248, fat: 60 },
    mealsPerDay: 5,
    restrictions: [],
    tags: ["vegetariano", "ovos", "laticínios", "proteína vegetal"],
    badgeLabel: "Ovo-Lacto Veg.",
    badgeColor: "green",
    clinicalNotes: "Dieta vegetariana que inclui ovos e laticínios. Atenção ao ferro não-heme (consumir com vitamina C) e vitamina B12.",
    contraindications: "Monitorar ferritina, vitamina B12 e zinco a cada 6 meses.",
    patientInstructions: "Combine leguminosas + cereais nas refeições para proteína completa (ex: feijão + arroz). Prefira ovos caipiras.",
    meals: [
      {
        id: "20-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 390,
        observations: null,
        foods: [
          {
            id: "20-r1-f1",
            name: "Pão integral",
            quantity: 2, unit: "fatia", grams: 60, calories: 156,
            macros: { cho: 28, ptn: 6, lip: 2 },
            substitutions: [
              { id: "s20-1", name: "Pão de centeio", quantity: 2, unit: "fatia", grams: 60, calories: 144, macros: { cho: 26, ptn: 5, lip: 2 }, note: null, restriction: null },
              { id: "s20-2", name: "Tapioca com queijo", quantity: 2, unit: "unidade", grams: 80, calories: 222, macros: { cho: 42, ptn: 8, lip: 4 }, note: null, restriction: null }
            ]
          },
          {
            id: "20-r1-f2",
            name: "Ovos mexidos (2 un)",
            quantity: 2, unit: "unidade", grams: 100, calories: 144,
            macros: { cho: 1, ptn: 13, lip: 10 },
            substitutions: [
              { id: "s20-3", name: "Queijo minas frescal", quantity: 2, unit: "fatia", grams: 60, calories: 114, macros: { cho: 1, ptn: 9, lip: 8 }, note: null, restriction: null },
              { id: "s20-4", name: "Iogurte grego", quantity: 1, unit: "pote (200g)", grams: 200, calories: 114, macros: { cho: 8, ptn: 20, lip: 4 }, note: null, restriction: null }
            ]
          },
          {
            id: "20-r1-f3",
            name: "Suco de laranja natural",
            quantity: 1, unit: "copo (200ml)", grams: 200, calories: 88,
            macros: { cho: 21, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s20-5", name: "Suco de acerola", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 60, macros: { cho: 14, ptn: 1, lip: 0 }, note: "Rico em vitamina C", restriction: null },
              { id: "s20-6", name: "Vitamina de fruta com leite", quantity: 1, unit: "copo (200ml)", grams: 200, calories: 120, macros: { cho: 22, ptn: 6, lip: 2 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "20-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 190,
        observations: null,
        foods: [
          {
            id: "20-r2-f1",
            name: "Iogurte natural + granola + frutas",
            quantity: 1, unit: "tigela", grams: 200, calories: 190,
            macros: { cho: 28, ptn: 8, lip: 5 },
            substitutions: [
              { id: "s20-7", name: "Ricota + mel + nozes", quantity: 1, unit: "tigela", grams: 100, calories: 160, macros: { cho: 12, ptn: 10, lip: 8 }, note: null, restriction: null },
              { id: "s20-8", name: "Queijo cottage + frutas vermelhas", quantity: 1, unit: "tigela", grams: 150, calories: 140, macros: { cho: 14, ptn: 14, lip: 3 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "20-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 540,
        observations: "Combine feijão + arroz para proteína completa.",
        foods: [
          {
            id: "20-r3-f1",
            name: "Arroz integral cozido",
            quantity: 6, unit: "colher de sopa", grams: 120, calories: 168,
            macros: { cho: 35, ptn: 4, lip: 1 },
            substitutions: [
              { id: "s20-9", name: "Quinoa cozida", quantity: 5, unit: "colher de sopa", grams: 100, calories: 135, macros: { cho: 23, ptn: 6, lip: 2 }, note: "Proteína completa", restriction: null },
              { id: "s20-10", name: "Macarrão integral cozido", quantity: 1, unit: "xícara", grams: 100, calories: 140, macros: { cho: 27, ptn: 5, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "20-r3-f2",
            name: "Feijão-carioca cozido",
            quantity: 3, unit: "concha", grams: 150, calories: 180,
            macros: { cho: 33, ptn: 12, lip: 1 },
            substitutions: [
              { id: "s20-11", name: "Lentilha cozida", quantity: 5, unit: "colher de sopa", grams: 100, calories: 115, macros: { cho: 20, ptn: 8, lip: 0 }, note: null, restriction: null },
              { id: "s20-12", name: "Grão-de-bico cozido", quantity: 4, unit: "colher de sopa", grams: 80, calories: 130, macros: { cho: 22, ptn: 7, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "20-r3-f3",
            name: "Omelete de 2 ovos com queijo",
            quantity: 1, unit: "unidade", grams: 120, calories: 210,
            macros: { cho: 1, ptn: 18, lip: 15 },
            substitutions: [
              { id: "s20-13", name: "Tofu grelhado com shoyu", quantity: 1, unit: "porção (120g)", grams: 120, calories: 96, macros: { cho: 2, ptn: 12, lip: 5 }, note: null, restriction: null },
              { id: "s20-14", name: "Queijo minas + salada", quantity: 1, unit: "porção", grams: 80, calories: 152, macros: { cho: 1, ptn: 12, lip: 11 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "20-ref4",
        name: "Lanche da tarde",
        time: "16:00",
        calories: 200,
        observations: null,
        foods: [
          {
            id: "20-r4-f1",
            name: "Vitamina de abacate + leite + mel",
            quantity: 1, unit: "copo (250ml)", grams: 280, calories: 200,
            macros: { cho: 22, ptn: 7, lip: 10 },
            substitutions: [
              { id: "s20-15", name: "Shake de proteína vegetal + leite", quantity: 1, unit: "copo (250ml)", grams: 250, calories: 200, macros: { cho: 20, ptn: 20, lip: 5 }, note: null, restriction: null },
              { id: "s20-16", name: "Vitamina de banana com iogurte", quantity: 1, unit: "copo (250ml)", grams: 300, calories: 190, macros: { cho: 32, ptn: 9, lip: 3 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "20-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 480,
        observations: null,
        foods: [
          {
            id: "20-r5-f1",
            name: "Macarrão integral com molho de tomate e queijo ralado",
            quantity: 2, unit: "xícara + molho", grams: 280, calories: 340,
            macros: { cho: 55, ptn: 14, lip: 8 },
            substitutions: [
              { id: "s20-17", name: "Arroz + feijão + ovo frito", quantity: 1, unit: "prato", grams: 280, calories: 400, macros: { cho: 55, ptn: 18, lip: 12 }, note: null, restriction: null },
              { id: "s20-18", name: "Nhoque com molho de tomate e parmesão", quantity: 1, unit: "porção", grams: 280, calories: 350, macros: { cho: 52, ptn: 12, lip: 10 }, note: null, restriction: null }
            ]
          },
          {
            id: "20-r5-f2",
            name: "Salada com azeite e limão",
            quantity: 1, unit: "prato raso", grams: 150, calories: 60,
            macros: { cho: 8, ptn: 2, lip: 3 },
            substitutions: [
              { id: "s20-19", name: "Brócolis + cenoura cozidos", quantity: 1, unit: "xícara", grams: 120, calories: 44, macros: { cho: 8, ptn: 3, lip: 0 }, note: null, restriction: null },
              { id: "s20-20", name: "Rúcula + tomate + azeite", quantity: 1, unit: "prato", grams: 130, calories: 70, macros: { cho: 6, ptn: 2, lip: 5 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },

  // ── PLANO 21 ─────────────────────────────────────────────────────────────
  {
    id: 21,
    slug: "vegano-1800kcal",
    name: "Vegano 1800 kcal",
    objective: "vegetariano",
    totalCalories: 1800,
    macros: { protein: 90, carbs: 248, fat: 60 },
    mealsPerDay: 5,
    restrictions: ["vegano"],
    tags: ["vegano", "plant-based", "sem animal", "proteína vegetal"],
    badgeLabel: "Vegano",
    badgeColor: "green",
    clinicalNotes: "Dieta 100% vegetal. Suplementar obrigatoriamente: vitamina B12, vitamina D, ômega-3 (DHA/EPA de algas), zinco e ferro.",
    contraindications: "Sem suplementação adequada, risco de deficiências nutricionais graves. Não indicar sem acompanhamento.",
    patientInstructions: "Varie as fontes de proteína vegetal diariamente. Fermente ou deixe o feijão de molho por 12h para melhorar absorção de zinco.",
    meals: [
      {
        id: "21-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 380,
        observations: "Use leites vegetais enriquecidos com cálcio.",
        foods: [
          {
            id: "21-r1-f1",
            name: "Aveia com leite de amêndoas e frutas",
            quantity: 1, unit: "tigela", grams: 250, calories: 280,
            macros: { cho: 46, ptn: 8, lip: 8 },
            substitutions: [
              { id: "s21-1", name: "Mingau de amaranto com leite de aveia", quantity: 1, unit: "tigela", grams: 250, calories: 270, macros: { cho: 44, ptn: 9, lip: 6 }, note: "Vegano", restriction: "vegano" },
              { id: "s21-2", name: "Toast de pão integral + pasta de amendoim", quantity: 1, unit: "porção", grams: 80, calories: 290, macros: { cho: 34, ptn: 9, lip: 14 }, note: "Vegano", restriction: "vegano" }
            ]
          },
          {
            id: "21-r1-f2",
            name: "Banana + tâmaras (2 un)",
            quantity: 1, unit: "porção", grams: 110, calories: 110,
            macros: { cho: 28, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s21-3", name: "Frutas vermelhas mistas", quantity: 1, unit: "xícara", grams: 120, calories: 70, macros: { cho: 17, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s21-4", name: "Manga + maracujá", quantity: 1, unit: "porção", grams: 150, calories: 95, macros: { cho: 23, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "21-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 220,
        observations: null,
        foods: [
          {
            id: "21-r2-f1",
            name: "Iogurte de coco + granola + frutas",
            quantity: 1, unit: "tigela", grams: 200, calories: 220,
            macros: { cho: 30, ptn: 4, lip: 10 },
            substitutions: [
              { id: "s21-5", name: "Smoothie de frutas + leite de soja", quantity: 1, unit: "copo (300ml)", grams: 300, calories: 200, macros: { cho: 36, ptn: 8, lip: 2 }, note: "Vegano", restriction: "vegano" },
              { id: "s21-6", name: "Pasta de amendoim + banana + torrada integral", quantity: 1, unit: "porção", grams: 100, calories: 260, macros: { cho: 28, ptn: 7, lip: 12 }, note: "Vegano", restriction: "vegano" }
            ]
          }
        ]
      },
      {
        id: "21-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 550,
        observations: "Leguminosas + cereais = proteína completa.",
        foods: [
          {
            id: "21-r3-f1",
            name: "Arroz integral cozido",
            quantity: 6, unit: "colher de sopa", grams: 120, calories: 168,
            macros: { cho: 35, ptn: 4, lip: 1 },
            substitutions: [
              { id: "s21-7", name: "Quinoa cozida", quantity: 5, unit: "colher de sopa", grams: 100, calories: 135, macros: { cho: 23, ptn: 6, lip: 2 }, note: "Proteína completa vegana", restriction: "vegano" },
              { id: "s21-8", name: "Cuscuz marroquino", quantity: 4, unit: "colher de sopa", grams: 80, calories: 144, macros: { cho: 30, ptn: 5, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "21-r3-f2",
            name: "Feijão-preto cozido",
            quantity: 3, unit: "concha", grams: 150, calories: 195,
            macros: { cho: 35, ptn: 14, lip: 1 },
            substitutions: [
              { id: "s21-9", name: "Grão-de-bico cozido", quantity: 4, unit: "colher de sopa", grams: 100, calories: 164, macros: { cho: 27, ptn: 9, lip: 3 }, note: "Vegano", restriction: "vegano" },
              { id: "s21-10", name: "Lentilha cozida", quantity: 5, unit: "colher de sopa", grams: 100, calories: 115, macros: { cho: 20, ptn: 8, lip: 0 }, note: "Vegano", restriction: "vegano" }
            ]
          },
          {
            id: "21-r3-f3",
            name: "Tofu firme grelhado",
            quantity: 1, unit: "porção (150g)", grams: 150, calories: 120,
            macros: { cho: 2, ptn: 15, lip: 7 },
            substitutions: [
              { id: "s21-11", name: "Tempeh fatiado grelhado", quantity: 1, unit: "porção (100g)", grams: 100, calories: 196, macros: { cho: 10, ptn: 20, lip: 11 }, note: "Vegano — mais proteico", restriction: "vegano" },
              { id: "s21-12", name: "Seitan grelhado", quantity: 1, unit: "porção (100g)", grams: 100, calories: 120, macros: { cho: 6, ptn: 21, lip: 2 }, note: "Vegano — contém glúten", restriction: null }
            ]
          },
          {
            id: "21-r3-f4",
            name: "Salada com azeite + sementes de girassol",
            quantity: 1, unit: "prato", grams: 150, calories: 100,
            macros: { cho: 8, ptn: 3, lip: 7 },
            substitutions: [
              { id: "s21-13", name: "Salada com tahine", quantity: 1, unit: "prato", grams: 150, calories: 120, macros: { cho: 8, ptn: 4, lip: 9 }, note: "Vegano", restriction: "vegano" },
              { id: "s21-14", name: "Brócolis + cenoura + linhaça", quantity: 1, unit: "porção", grams: 130, calories: 80, macros: { cho: 10, ptn: 4, lip: 4 }, note: "Vegano", restriction: "vegano" }
            ]
          }
        ]
      },
      {
        id: "21-ref4",
        name: "Lanche da tarde",
        time: "16:00",
        calories: 200,
        observations: null,
        foods: [
          {
            id: "21-r4-f1",
            name: "Hummus + palitos de cenoura e pepino",
            quantity: 1, unit: "porção", grams: 150, calories: 150,
            macros: { cho: 16, ptn: 6, lip: 8 },
            substitutions: [
              { id: "s21-15", name: "Guacamole + torrada integral", quantity: 1, unit: "porção", grams: 120, calories: 180, macros: { cho: 18, ptn: 3, lip: 11 }, note: "Vegano", restriction: "vegano" },
              { id: "s21-16", name: "Pasta de amendoim + maçã fatiada", quantity: 1, unit: "porção", grams: 140, calories: 200, macros: { cho: 22, ptn: 5, lip: 10 }, note: "Vegano", restriction: "vegano" }
            ]
          }
        ]
      },
      {
        id: "21-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 450,
        observations: "Fontes de ômega-3 vegetal: linhaça, chia, nozes.",
        foods: [
          {
            id: "21-r5-f1",
            name: "Strogonoff de grão-de-bico + arroz",
            quantity: 1, unit: "prato", grams: 350, calories: 380,
            macros: { cho: 60, ptn: 16, lip: 10 },
            substitutions: [
              { id: "s21-17", name: "Curry de lentilha com arroz integral", quantity: 1, unit: "prato", grams: 350, calories: 360, macros: { cho: 58, ptn: 16, lip: 7 }, note: "Vegano", restriction: "vegano" },
              { id: "s21-18", name: "Hambúrguer de feijão + batata-doce", quantity: 1, unit: "prato", grams: 350, calories: 390, macros: { cho: 62, ptn: 18, lip: 9 }, note: "Vegano", restriction: "vegano" }
            ]
          },
          {
            id: "21-r5-f2",
            name: "Sementes de chia + linhaça",
            quantity: 1, unit: "colher de sopa cada", grams: 20, calories: 78,
            macros: { cho: 5, ptn: 3, lip: 5 },
            substitutions: [
              { id: "s21-19", name: "Nozes picadas", quantity: 1, unit: "punhado (15g)", grams: 15, calories: 98, macros: { cho: 2, ptn: 2, lip: 10 }, note: "Vegano — rico em ômega-3", restriction: "vegano" },
              { id: "s21-20", name: "Sementes de abóbora", quantity: 1, unit: "colher de sopa", grams: 15, calories: 85, macros: { cho: 2, ptn: 4, lip: 7 }, note: "Vegano", restriction: "vegano" }
            ]
          }
        ]
      }
    ]
  }
,
  {
    id: 22,
    slug: "sem-lactose-gluten-1800",
    name: "Sem Lactose e Glúten 1800 kcal",
    objective: "manutencao",
    totalCalories: 1800,
    macros: { protein: 90, carbs: 225, fat: 60 },
    mealsPerDay: 5,
    restrictions: ["sem_lactose", "sem_gluten"],
    tags: ["sem lactose", "sem glúten", "intolerâncias", "doença celíaca"],
    badgeLabel: "Sem Lactose/Glúten",
    badgeColor: "yellow",
    clinicalNotes: "Indicado para pacientes com intolerância à lactose e doença celíaca ou sensibilidade ao glúten. Todos os alimentos são naturalmente livres de glúten e lactose. Atentar à contaminação cruzada.",
    contraindications: "Verificar rotulagem de todos os alimentos industrializados. Evitar farinhas de trigo, cevada, centeio e malte. Evitar leite e derivados.",
    patientInstructions: "Leia sempre os rótulos dos alimentos. Prefira alimentos naturais e integrais sem glúten. Substitua leite por bebidas vegetais (amêndoa, coco, arroz).",
    meals: [
      {
        id: "22-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 380,
        observations: "Usar aveia certificada sem glúten.",
        foods: [
          {
            id: "22-r1-f1",
            name: "Tapioca recheada com frango",
            quantity: 2, unit: "unidades médias", grams: 180, calories: 240,
            macros: { cho: 36, ptn: 18, lip: 4 },
            substitutions: [
              { id: "s22-1", name: "Panqueca de banana + ovo", quantity: 2, unit: "unidades", grams: 150, calories: 220, macros: { cho: 28, ptn: 12, lip: 7 }, note: "Sem glúten e sem lactose", restriction: "sem_gluten" },
              { id: "s22-2", name: "Pão de queijo (versão sem lactose)", quantity: 3, unit: "unidades", grams: 120, calories: 250, macros: { cho: 38, ptn: 8, lip: 8 }, note: "Usar queijo sem lactose", restriction: "sem_lactose" }
            ]
          },
          {
            id: "22-r1-f2",
            name: "Bebida vegetal de amêndoa com cacau sem açúcar",
            quantity: 200, unit: "ml", grams: 200, calories: 90,
            macros: { cho: 8, ptn: 2, lip: 5 },
            substitutions: [
              { id: "s22-3", name: "Bebida de coco sem açúcar", quantity: 200, unit: "ml", grams: 200, calories: 80, macros: { cho: 6, ptn: 1, lip: 5 }, note: "Sem lactose", restriction: "sem_lactose" },
              { id: "s22-4", name: "Suco de laranja natural", quantity: 200, unit: "ml", grams: 200, calories: 90, macros: { cho: 20, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "22-r1-f3",
            name: "Banana média",
            quantity: 1, unit: "unidade", grams: 100, calories: 89,
            macros: { cho: 23, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s22-5", name: "Maçã média", quantity: 1, unit: "unidade", grams: 130, calories: 68, macros: { cho: 18, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s22-6", name: "Pera média", quantity: 1, unit: "unidade", grams: 130, calories: 72, macros: { cho: 19, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "22-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 200,
        observations: null,
        foods: [
          {
            id: "22-r2-f1",
            name: "Mix de castanhas e amêndoas",
            quantity: 1, unit: "punhado (30g)", grams: 30, calories: 180,
            macros: { cho: 6, ptn: 5, lip: 15 },
            substitutions: [
              { id: "s22-7", name: "Arroz-wafer sem glúten com geleia de frutas", quantity: 1, unit: "porção", grams: 50, calories: 160, macros: { cho: 32, ptn: 2, lip: 1 }, note: "Sem glúten e sem lactose", restriction: "sem_gluten" },
              { id: "s22-8", name: "Coco ralado com tâmaras", quantity: 1, unit: "porção", grams: 40, calories: 190, macros: { cho: 22, ptn: 2, lip: 10 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "22-ref3",
        name: "Almoço",
        time: "12:30",
        calories: 550,
        observations: "Evitar temperos industrializados com glúten.",
        foods: [
          {
            id: "22-r3-f1",
            name: "Arroz branco",
            quantity: 4, unit: "colheres de servir", grams: 200, calories: 260,
            macros: { cho: 56, ptn: 5, lip: 1 },
            substitutions: [
              { id: "s22-9", name: "Quinoa cozida", quantity: 1, unit: "xícara", grams: 180, calories: 220, macros: { cho: 39, ptn: 8, lip: 4 }, note: "Sem glúten — proteína completa", restriction: "sem_gluten" },
              { id: "s22-10", name: "Batata-doce cozida", quantity: 1, unit: "unidade média", grams: 200, calories: 172, macros: { cho: 40, ptn: 3, lip: 0 }, note: "Sem glúten", restriction: "sem_gluten" }
            ]
          },
          {
            id: "22-r3-f2",
            name: "Frango grelhado temperado com ervas",
            quantity: 1, unit: "filé médio", grams: 150, calories: 198,
            macros: { cho: 0, ptn: 36, lip: 5 },
            substitutions: [
              { id: "s22-11", name: "Peixe assado (tilápia ou salmão)", quantity: 1, unit: "filé médio", grams: 150, calories: 200, macros: { cho: 0, ptn: 30, lip: 8 }, note: "Sem glúten e sem lactose", restriction: "sem_gluten" },
              { id: "s22-12", name: "Carne bovina magra grelhada", quantity: 1, unit: "porção", grams: 120, calories: 210, macros: { cho: 0, ptn: 28, lip: 10 }, note: "Sem glúten", restriction: "sem_gluten" }
            ]
          },
          {
            id: "22-r3-f3",
            name: "Salada de folhas e legumes refogados no azeite",
            quantity: 1, unit: "prato", grams: 200, calories: 90,
            macros: { cho: 8, ptn: 3, lip: 5 },
            substitutions: [
              { id: "s22-13", name: "Legumes cozidos no vapor", quantity: 1, unit: "porção", grams: 200, calories: 80, macros: { cho: 12, ptn: 4, lip: 2 }, note: null, restriction: null },
              { id: "s22-14", name: "Salada de beterraba com limão e azeite", quantity: 1, unit: "porção", grams: 180, calories: 95, macros: { cho: 14, ptn: 2, lip: 4 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "22-ref4",
        name: "Lanche da tarde",
        time: "16:00",
        calories: 250,
        observations: null,
        foods: [
          {
            id: "22-r4-f1",
            name: "Vitamina de fruta com leite de amêndoa",
            quantity: 300, unit: "ml", grams: 300, calories: 180,
            macros: { cho: 28, ptn: 4, lip: 6 },
            substitutions: [
              { id: "s22-15", name: "Iogurte sem lactose com granola sem glúten", quantity: 1, unit: "porção", grams: 180, calories: 200, macros: { cho: 26, ptn: 8, lip: 6 }, note: "Verificar rotulagem da granola", restriction: "sem_gluten" },
              { id: "s22-16", name: "Smoothie de banana com espinafre e leite de coco", quantity: 300, unit: "ml", grams: 300, calories: 190, macros: { cho: 30, ptn: 3, lip: 7 }, note: "Sem glúten e sem lactose", restriction: "sem_lactose" }
            ]
          },
          {
            id: "22-r4-f2",
            name: "Laranja ou tangerina",
            quantity: 1, unit: "unidade", grams: 120, calories: 62,
            macros: { cho: 15, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s22-17", name: "Kiwi", quantity: 1, unit: "unidade", grams: 80, calories: 48, macros: { cho: 11, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s22-18", name: "Pêssego médio", quantity: 1, unit: "unidade", grams: 120, calories: 58, macros: { cho: 14, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "22-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 420,
        observations: "Verificar molhos e condimentos — muitos contêm glúten oculto.",
        foods: [
          {
            id: "22-r5-f1",
            name: "Macarrão de arroz com molho de tomate e frango",
            quantity: 1, unit: "prato", grams: 350, calories: 380,
            macros: { cho: 52, ptn: 22, lip: 10 },
            substitutions: [
              { id: "s22-19", name: "Risoto de quinoa com legumes", quantity: 1, unit: "prato", grams: 350, calories: 360, macros: { cho: 48, ptn: 14, lip: 11 }, note: "Sem glúten", restriction: "sem_gluten" },
              { id: "s22-20", name: "Omelete de claras com legumes e batata-doce", quantity: 1, unit: "porção", grams: 320, calories: 340, macros: { cho: 30, ptn: 26, lip: 11 }, note: "Sem glúten e sem lactose", restriction: "sem_gluten" }
            ]
          },
          {
            id: "22-r5-f2",
            name: "Salada verde simples",
            quantity: 1, unit: "prato raso", grams: 80, calories: 40,
            macros: { cho: 5, ptn: 2, lip: 1 },
            substitutions: [
              { id: "s22-21", name: "Pepino com limão e azeite", quantity: 1, unit: "porção", grams: 100, calories: 35, macros: { cho: 5, ptn: 1, lip: 2 }, note: null, restriction: null },
              { id: "s22-22", name: "Tomate com manjericão e azeite", quantity: 1, unit: "porção", grams: 100, calories: 45, macros: { cho: 6, ptn: 1, lip: 2 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 23,
    slug: "pediatrico-7-8-meses",
    name: "Pediátrico 7–8 meses",
    objective: "pediatrico",
    totalCalories: 800,
    macros: { protein: 18, carbs: 100, fat: 30 },
    mealsPerDay: 2,
    restrictions: [],
    tags: ["bebê", "7 meses", "8 meses", "introdução alimentar", "papinha"],
    badgeLabel: "Pediátrico 7–8m",
    badgeColor: "purple",
    clinicalNotes: "Complementar ao leite materno ou fórmula. Introdução alimentar complementar. Oferecer papinhas de consistência amassada/pastosa. Iniciar com um alimento novo por vez. Calorias aproximadas — leite materno não contabilizado.",
    contraindications: "Não oferecer mel, açúcar, sal em excesso, alimentos ultraprocessados. Não oferecer leite de vaca como bebida principal antes dos 12 meses.",
    patientInstructions: "Continue o aleitamento materno em livre demanda. Ofereça papinha de frutas no lanche e papinha de legumes e proteína no almoço. Apresente novos alimentos com intervalo de 3–5 dias.",
    meals: [
      {
        id: "23-ref1",
        name: "Papinha de frutas (lanche)",
        time: "10:00",
        calories: 120,
        observations: "Amassar bem. Não adicionar açúcar.",
        foods: [
          {
            id: "23-r1-f1",
            name: "Banana amassada",
            quantity: 0.5, unit: "unidade média", grams: 50, calories: 44,
            macros: { cho: 11, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s23-1", name: "Mamão papaia amassado", quantity: 3, unit: "colheres de sopa", grams: 60, calories: 26, macros: { cho: 6, ptn: 0, lip: 0 }, note: "Ótimo para digestão", restriction: null },
              { id: "s23-2", name: "Pera cozida amassada", quantity: 3, unit: "colheres de sopa", grams: 60, calories: 30, macros: { cho: 8, ptn: 0, lip: 0 }, note: "Boa tolerância para bebês", restriction: null }
            ]
          },
          {
            id: "23-r1-f2",
            name: "Maçã cozida e amassada",
            quantity: 2, unit: "colheres de sopa", grams: 40, calories: 21,
            macros: { cho: 5, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s23-3", name: "Manga madura amassada", quantity: 2, unit: "colheres de sopa", grams: 40, calories: 26, macros: { cho: 6, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s23-4", name: "Goiaba sem sementes amassada", quantity: 2, unit: "colheres de sopa", grams: 40, calories: 27, macros: { cho: 6, ptn: 0, lip: 0 }, note: "Rica em vitamina C", restriction: null }
            ]
          },
          {
            id: "23-r1-f3",
            name: "Cereal infantil de arroz sem açúcar",
            quantity: 1, unit: "colher de sopa", grams: 10, calories: 38,
            macros: { cho: 8, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s23-5", name: "Farinha de mandioca fina", quantity: 1, unit: "colher de chá", grams: 5, calories: 18, macros: { cho: 4, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s23-6", name: "Flocos de arroz instantâneos", quantity: 1, unit: "colher de sopa", grams: 10, calories: 36, macros: { cho: 8, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "23-ref2",
        name: "Papinha salgada (almoço)",
        time: "12:00",
        calories: 200,
        observations: "Consistência pastosa/amassada. Mínimo de sal. Incluir 1 legume, 1 vegetal, 1 proteína e 1 cereal.",
        foods: [
          {
            id: "23-r2-f1",
            name: "Arroz bem cozido amassado",
            quantity: 2, unit: "colheres de sopa", grams: 40, calories: 52,
            macros: { cho: 11, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s23-7", name: "Batata cozida e amassada", quantity: 2, unit: "colheres de sopa", grams: 40, calories: 35, macros: { cho: 8, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s23-8", name: "Macarrão cabelo-de-anjo bem cozido", quantity: 2, unit: "colheres de sopa", grams: 40, calories: 50, macros: { cho: 10, ptn: 2, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "23-r2-f2",
            name: "Frango desfiado bem cozido",
            quantity: 2, unit: "colheres de sopa", grams: 30, calories: 40,
            macros: { cho: 0, ptn: 9, lip: 1 },
            substitutions: [
              { id: "s23-9", name: "Carne bovina moída bem cozida", quantity: 2, unit: "colheres de sopa", grams: 30, calories: 45, macros: { cho: 0, ptn: 7, lip: 2 }, note: null, restriction: null },
              { id: "s23-10", name: "Fígado de frango bem cozido e amassado", quantity: 1, unit: "colher de sopa", grams: 20, calories: 30, macros: { cho: 1, ptn: 5, lip: 1 }, note: "Rico em ferro — 2x por semana", restriction: null }
            ]
          },
          {
            id: "23-r2-f3",
            name: "Cenoura cozida e amassada",
            quantity: 2, unit: "colheres de sopa", grams: 50, calories: 20,
            macros: { cho: 5, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s23-11", name: "Abobrinha cozida amassada", quantity: 2, unit: "colheres de sopa", grams: 50, calories: 12, macros: { cho: 3, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s23-12", name: "Batata-doce cozida amassada", quantity: 2, unit: "colheres de sopa", grams: 50, calories: 43, macros: { cho: 10, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "23-r2-f4",
            name: "Azeite de oliva extra virgem",
            quantity: 1, unit: "colher de chá", grams: 5, calories: 44,
            macros: { cho: 0, ptn: 0, lip: 5 },
            substitutions: [
              { id: "s23-13", name: "Óleo de coco extravirgem", quantity: 1, unit: "colher de chá", grams: 5, calories: 44, macros: { cho: 0, ptn: 0, lip: 5 }, note: null, restriction: null },
              { id: "s23-14", name: "Manteiga sem sal", quantity: 0.5, unit: "colher de chá", grams: 3, calories: 22, macros: { cho: 0, ptn: 0, lip: 2 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 24,
    slug: "pediatrico-9-11-meses",
    name: "Pediátrico 9–11 meses",
    objective: "pediatrico",
    totalCalories: 900,
    macros: { protein: 22, carbs: 115, fat: 33 },
    mealsPerDay: 3,
    restrictions: [],
    tags: ["bebê", "9 meses", "10 meses", "11 meses", "introdução alimentar"],
    badgeLabel: "Pediátrico 9–11m",
    badgeColor: "purple",
    clinicalNotes: "Complementar ao leite materno ou fórmula. Textura progride para pedaços pequenos moles. Pode iniciar BLW (Baby-Led Weaning) com supervisão. Três refeições complementares ao dia.",
    contraindications: "Não oferecer mel, açúcar adicionado, alimentos ultraprocessados, sal em excesso. Frutos do mar e amendoim devem ser introduzidos com cautela.",
    patientInstructions: "Ofereça alimentos em pedaços pequenos e macios. Continue o aleitamento materno. Sente o bebê junto à mesa para refeições em família.",
    meals: [
      {
        id: "24-ref1",
        name: "Café da manhã",
        time: "07:30",
        calories: 180,
        observations: "Pode incluir fruta amassada ou em pedaços pequenos.",
        foods: [
          {
            id: "24-r1-f1",
            name: "Banana fatiada em pedaços pequenos",
            quantity: 0.5, unit: "unidade", grams: 50, calories: 44,
            macros: { cho: 11, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s24-1", name: "Mamão em cubinhos", quantity: 3, unit: "colheres de sopa", grams: 60, calories: 26, macros: { cho: 6, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s24-2", name: "Uva sem semente cortada ao meio", quantity: 6, unit: "unidades", grams: 60, calories: 41, macros: { cho: 10, ptn: 0, lip: 0 }, note: "Cortar sempre ao meio", restriction: null }
            ]
          },
          {
            id: "24-r1-f2",
            name: "Omelete de ovo mole (1 ovo)",
            quantity: 1, unit: "omelete pequeno", grams: 50, calories: 77,
            macros: { cho: 0, ptn: 6, lip: 5 },
            substitutions: [
              { id: "s24-3", name: "Ovo mexido mole", quantity: 1, unit: "ovo", grams: 50, calories: 77, macros: { cho: 0, ptn: 6, lip: 5 }, note: "Bem cozido", restriction: null },
              { id: "s24-4", name: "Iogurte integral natural sem açúcar", quantity: 3, unit: "colheres de sopa", grams: 60, calories: 38, macros: { cho: 3, ptn: 3, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "24-r1-f3",
            name: "Torrada integral em palito",
            quantity: 1, unit: "fatia", grams: 20, calories: 53,
            macros: { cho: 10, ptn: 2, lip: 1 },
            substitutions: [
              { id: "s24-5", name: "Tapioca pequena", quantity: 1, unit: "disco", grams: 25, calories: 55, macros: { cho: 13, ptn: 0, lip: 0 }, note: "Sem glúten", restriction: "sem_gluten" },
              { id: "s24-6", name: "Biscoito de arroz sem sal", quantity: 1, unit: "unidade", grams: 10, calories: 38, macros: { cho: 8, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "24-ref2",
        name: "Almoço",
        time: "12:00",
        calories: 300,
        observations: "Consistência mole com pedaços pequenos. Variar proteína a cada dia.",
        foods: [
          {
            id: "24-r2-f1",
            name: "Arroz papa bem cozido",
            quantity: 3, unit: "colheres de sopa", grams: 60, calories: 78,
            macros: { cho: 17, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s24-7", name: "Purê de batata com azeite", quantity: 3, unit: "colheres de sopa", grams: 60, calories: 65, macros: { cho: 13, ptn: 1, lip: 2 }, note: null, restriction: null },
              { id: "s24-8", name: "Macarrão parafuso miúdo bem cozido", quantity: 3, unit: "colheres de sopa", grams: 60, calories: 75, macros: { cho: 15, ptn: 2, lip: 1 }, note: null, restriction: null }
            ]
          },
          {
            id: "24-r2-f2",
            name: "Feijão caldo grosso",
            quantity: 2, unit: "colheres de sopa", grams: 50, calories: 40,
            macros: { cho: 7, ptn: 3, lip: 0 },
            substitutions: [
              { id: "s24-9", name: "Lentilha cozida amassada", quantity: 2, unit: "colheres de sopa", grams: 50, calories: 42, macros: { cho: 7, ptn: 3, lip: 0 }, note: null, restriction: null },
              { id: "s24-10", name: "Ervilha cozida amassada", quantity: 2, unit: "colheres de sopa", grams: 50, calories: 38, macros: { cho: 7, ptn: 2, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "24-r2-f3",
            name: "Frango desfiado ou em lascas",
            quantity: 2, unit: "colheres de sopa", grams: 40, calories: 53,
            macros: { cho: 0, ptn: 10, lip: 1 },
            substitutions: [
              { id: "s24-11", name: "Peixe branco em lascas (merluza ou tilápia)", quantity: 2, unit: "colheres de sopa", grams: 40, calories: 45, macros: { cho: 0, ptn: 9, lip: 1 }, note: "Verificar espinhas", restriction: null },
              { id: "s24-12", name: "Carne moída refogada", quantity: 2, unit: "colheres de sopa", grams: 40, calories: 60, macros: { cho: 0, ptn: 8, lip: 3 }, note: null, restriction: null }
            ]
          },
          {
            id: "24-r2-f4",
            name: "Legumes variados cozidos",
            quantity: 2, unit: "colheres de sopa", grams: 50, calories: 22,
            macros: { cho: 4, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s24-13", name: "Brócolis cozido em flores pequenas", quantity: 2, unit: "colheres de sopa", grams: 50, calories: 17, macros: { cho: 3, ptn: 1, lip: 0 }, note: null, restriction: null },
              { id: "s24-14", name: "Chuchu e cenoura cozidos", quantity: 2, unit: "colheres de sopa", grams: 50, calories: 18, macros: { cho: 4, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "24-ref3",
        name: "Jantar",
        time: "18:30",
        calories: 250,
        observations: "Jantar mais leve. Pode repetir alimentos do almoço.",
        foods: [
          {
            id: "24-r3-f1",
            name: "Sopa de legumes com frango",
            quantity: 1, unit: "bowl pequeno", grams: 200, calories: 140,
            macros: { cho: 18, ptn: 9, lip: 3 },
            substitutions: [
              { id: "s24-15", name: "Mingau de aveia com banana", quantity: 1, unit: "bowl pequeno", grams: 200, calories: 160, macros: { cho: 28, ptn: 5, lip: 3 }, note: null, restriction: null },
              { id: "s24-16", name: "Creme de abóbora com frango", quantity: 1, unit: "bowl pequeno", grams: 200, calories: 130, macros: { cho: 15, ptn: 8, lip: 4 }, note: null, restriction: null }
            ]
          },
          {
            id: "24-r3-f2",
            name: "Fruta amassada ou em pedaços",
            quantity: 0.5, unit: "unidade", grams: 60, calories: 40,
            macros: { cho: 10, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s24-17", name: "Ameixa fresca amassada", quantity: 1, unit: "unidade", grams: 60, calories: 30, macros: { cho: 7, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s24-18", name: "Pera madura em pedaços", quantity: 0.5, unit: "unidade", grams: 60, calories: 33, macros: { cho: 9, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 25,
    slug: "pediatrico-12-meses",
    name: "Pediátrico 12 meses+",
    objective: "pediatrico",
    totalCalories: 1100,
    macros: { protein: 30, carbs: 140, fat: 38 },
    mealsPerDay: 5,
    restrictions: [],
    tags: ["toddler", "1 ano", "12 meses", "alimentação infantil"],
    badgeLabel: "Pediátrico 12m+",
    badgeColor: "purple",
    clinicalNotes: "A partir dos 12 meses a criança pode consumir a maior parte dos alimentos da família em texturas adaptadas. Leite de vaca integral pode ser introduzido. Evitar açúcar, sal em excesso e ultraprocessados.",
    contraindications: "Reduzir ao mínimo açúcar e sal. Alimentos com risco de engasgo (uvas inteiras, nozes inteiras, cenoura crua em pedaços grandes).",
    patientInstructions: "Ofereça 5 refeições por dia. Inclua a criança nas refeições da família. Não force a alimentação — ofereça variedade e respeite a saciedade.",
    meals: [
      {
        id: "25-ref1",
        name: "Café da manhã",
        time: "07:30",
        calories: 220,
        observations: null,
        foods: [
          {
            id: "25-r1-f1",
            name: "Leite integral (200ml)",
            quantity: 200, unit: "ml", grams: 200, calories: 130,
            macros: { cho: 10, ptn: 6, lip: 7 },
            substitutions: [
              { id: "s25-1", name: "Iogurte integral natural sem açúcar", quantity: 150, unit: "ml", grams: 150, calories: 95, macros: { cho: 7, ptn: 6, lip: 5 }, note: null, restriction: null },
              { id: "s25-2", name: "Leite materno", quantity: 1, unit: "mamada", grams: 180, calories: 120, macros: { cho: 14, ptn: 2, lip: 6 }, note: "Continuar conforme demanda", restriction: null }
            ]
          },
          {
            id: "25-r1-f2",
            name: "Banana amassada ou fatiada",
            quantity: 0.5, unit: "unidade", grams: 50, calories: 44,
            macros: { cho: 11, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s25-3", name: "Mamão papaia (2 colheres)", quantity: 2, unit: "colheres de sopa", grams: 60, calories: 26, macros: { cho: 6, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s25-4", name: "Manga madura (2 colheres)", quantity: 2, unit: "colheres de sopa", grams: 50, calories: 32, macros: { cho: 8, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "25-r1-f3",
            name: "Pão de forma integral (1 fatia)",
            quantity: 1, unit: "fatia", grams: 25, calories: 62,
            macros: { cho: 12, ptn: 2, lip: 1 },
            substitutions: [
              { id: "s25-5", name: "Tapioca pequena", quantity: 1, unit: "disco", grams: 30, calories: 66, macros: { cho: 16, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s25-6", name: "Biscoito de arroz sem sal", quantity: 2, unit: "unidades", grams: 20, calories: 76, macros: { cho: 16, ptn: 1, lip: 1 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "25-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 120,
        observations: null,
        foods: [
          {
            id: "25-r2-f1",
            name: "Fruta picada (melancia ou melão)",
            quantity: 1, unit: "fatia pequena", grams: 100, calories: 38,
            macros: { cho: 9, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s25-7", name: "Uva sem semente cortada ao meio", quantity: 10, unit: "unidades", grams: 80, calories: 55, macros: { cho: 14, ptn: 1, lip: 0 }, note: "Sempre cortar ao meio", restriction: null },
              { id: "s25-8", name: "Pêssego maduro em cubinhos", quantity: 1, unit: "unidade pequena", grams: 80, calories: 38, macros: { cho: 10, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          },
          {
            id: "25-r2-f2",
            name: "Biscoito caseiro de banana e aveia",
            quantity: 2, unit: "unidades", grams: 30, calories: 80,
            macros: { cho: 14, ptn: 2, lip: 2 },
            substitutions: [
              { id: "s25-9", name: "Bolo simples caseiro sem açúcar", quantity: 1, unit: "fatia pequena", grams: 30, calories: 85, macros: { cho: 15, ptn: 2, lip: 2 }, note: null, restriction: null },
              { id: "s25-10", name: "Cuscuz de milho cozido", quantity: 1, unit: "fatia pequena", grams: 40, calories: 68, macros: { cho: 14, ptn: 2, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "25-ref3",
        name: "Almoço",
        time: "12:00",
        calories: 350,
        observations: "Textura familiar adaptada. Evitar alimentos muito temperados.",
        foods: [
          {
            id: "25-r3-f1",
            name: "Arroz branco com feijão",
            quantity: 3, unit: "colheres de servir", grams: 150, calories: 180,
            macros: { cho: 34, ptn: 8, lip: 1 },
            substitutions: [
              { id: "s25-11", name: "Macarrão miúdo com molho de tomate", quantity: 1, unit: "prato pequeno", grams: 150, calories: 195, macros: { cho: 38, ptn: 6, lip: 2 }, note: null, restriction: null },
              { id: "s25-12", name: "Purê de batata com manteiga", quantity: 1, unit: "porção pequena", grams: 150, calories: 165, macros: { cho: 28, ptn: 4, lip: 5 }, note: null, restriction: null }
            ]
          },
          {
            id: "25-r3-f2",
            name: "Frango ou carne em pedaços pequenos",
            quantity: 2, unit: "colheres de sopa", grams: 50, calories: 66,
            macros: { cho: 0, ptn: 12, lip: 2 },
            substitutions: [
              { id: "s25-13", name: "Peixe sem espinhas em lascas", quantity: 2, unit: "colheres de sopa", grams: 50, calories: 55, macros: { cho: 0, ptn: 11, lip: 1 }, note: null, restriction: null },
              { id: "s25-14", name: "Ovo cozido picado", quantity: 1, unit: "unidade", grams: 50, calories: 77, macros: { cho: 0, ptn: 6, lip: 5 }, note: null, restriction: null }
            ]
          },
          {
            id: "25-r3-f3",
            name: "Legumes cozidos variados",
            quantity: 2, unit: "colheres de sopa", grams: 60, calories: 25,
            macros: { cho: 5, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s25-15", name: "Chuchu e cenoura refogados no azeite", quantity: 2, unit: "colheres", grams: 60, calories: 30, macros: { cho: 5, ptn: 1, lip: 1 }, note: null, restriction: null },
              { id: "s25-16", name: "Abóbora cozida amassada", quantity: 2, unit: "colheres de sopa", grams: 60, calories: 20, macros: { cho: 5, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "25-ref4",
        name: "Lanche da tarde",
        time: "15:30",
        calories: 160,
        observations: null,
        foods: [
          {
            id: "25-r4-f1",
            name: "Iogurte integral com fruta",
            quantity: 100, unit: "ml", grams: 100, calories: 100,
            macros: { cho: 10, ptn: 4, lip: 4 },
            substitutions: [
              { id: "s25-17", name: "Vitamina de fruta com leite integral", quantity: 150, unit: "ml", grams: 150, calories: 110, macros: { cho: 15, ptn: 4, lip: 4 }, note: null, restriction: null },
              { id: "s25-18", name: "Leite com cacau sem açúcar", quantity: 150, unit: "ml", grams: 150, calories: 100, macros: { cho: 10, ptn: 5, lip: 5 }, note: null, restriction: null }
            ]
          },
          {
            id: "25-r4-f2",
            name: "Biscoito de arroz ou maisena",
            quantity: 2, unit: "unidades", grams: 15, calories: 60,
            macros: { cho: 12, ptn: 1, lip: 1 },
            substitutions: [
              { id: "s25-19", name: "Fruta em pedaços (pera ou maçã)", quantity: 0.5, unit: "unidade", grams: 60, calories: 35, macros: { cho: 9, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s25-20", name: "Mini sanduíche de pão integral com queijo", quantity: 1, unit: "unidade pequena", grams: 35, calories: 70, macros: { cho: 8, ptn: 4, lip: 2 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "25-ref5",
        name: "Jantar",
        time: "18:30",
        calories: 250,
        observations: "Jantar semelhante ao almoço, mais simples.",
        foods: [
          {
            id: "25-r5-f1",
            name: "Sopa cremosa de legumes com macarrão miúdo",
            quantity: 1, unit: "bowl (200ml)", grams: 250, calories: 180,
            macros: { cho: 28, ptn: 8, lip: 4 },
            substitutions: [
              { id: "s25-21", name: "Creme de mandioquinha com frango", quantity: 1, unit: "bowl", grams: 250, calories: 190, macros: { cho: 30, ptn: 10, lip: 4 }, note: null, restriction: null },
              { id: "s25-22", name: "Papa de arroz com legumes e frango desfiado", quantity: 1, unit: "bowl", grams: 250, calories: 175, macros: { cho: 26, ptn: 10, lip: 3 }, note: null, restriction: null }
            ]
          },
          {
            id: "25-r5-f2",
            name: "Fruta (banana ou mamão)",
            quantity: 0.5, unit: "unidade", grams: 60, calories: 44,
            macros: { cho: 11, ptn: 0, lip: 0 },
            substitutions: [
              { id: "s25-23", name: "Compota de frutas caseira sem açúcar", quantity: 3, unit: "colheres de sopa", grams: 80, calories: 40, macros: { cho: 10, ptn: 0, lip: 0 }, note: null, restriction: null },
              { id: "s25-24", name: "Kiwi em fatias pequenas", quantity: 0.5, unit: "unidade", grams: 40, calories: 25, macros: { cho: 6, ptn: 0, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 26,
    slug: "idoso-disfagia-1600",
    name: "3ª Idade Disfagia 1600 kcal",
    objective: "idoso",
    totalCalories: 1600,
    macros: { protein: 80, carbs: 200, fat: 44 },
    mealsPerDay: 6,
    restrictions: ["disfagia"],
    tags: ["idoso", "disfagia", "textura modificada", "pastoso"],
    badgeLabel: "Disfagia Idoso",
    badgeColor: "gray",
    clinicalNotes: "Para pacientes idosos com disfagia leve a moderada. Todos os alimentos em consistência pastosa/cremosa (IDDSI nível 4–5). Evitar alimentos granulosos, secos ou com pedaços. Avaliar necessidade de espessante para líquidos.",
    contraindications: "Evitar alimentos duros, crocantes ou secos. Líquidos ralos devem ser espessados se houver risco de aspiração.",
    patientInstructions: "Todos os alimentos devem ser cremosos ou em forma de creme/sopa grossa. Comer sentado, em posição ereta, sem pressa. Oferecer pequenas quantidades a cada garfada.",
    meals: [
      {
        id: "26-ref1",
        name: "Café da manhã",
        time: "07:30",
        calories: 280,
        observations: "Consistência cremosa/pastosa. Espessar líquidos se indicado.",
        foods: [
          {
            id: "26-r1-f1",
            name: "Mingau de aveia cremoso com leite integral",
            quantity: 1, unit: "tigela (250ml)", grams: 300, calories: 200,
            macros: { cho: 30, ptn: 8, lip: 6 },
            substitutions: [
              { id: "s26-1", name: "Mingau de maisena com leite e mel", quantity: 1, unit: "tigela (250ml)", grams: 300, calories: 210, macros: { cho: 36, ptn: 6, lip: 5 }, note: "Textura mais suave", restriction: "disfagia" },
              { id: "s26-2", name: "Vitamina de banana com aveia e mel", quantity: 250, unit: "ml", grams: 300, calories: 195, macros: { cho: 32, ptn: 6, lip: 5 }, note: "Consistência espessa", restriction: "disfagia" }
            ]
          },
          {
            id: "26-r1-f2",
            name: "Iogurte cremoso natural",
            quantity: 100, unit: "g", grams: 100, calories: 80,
            macros: { cho: 6, ptn: 5, lip: 3 },
            substitutions: [
              { id: "s26-3", name: "Creme de ricota batido liso", quantity: 80, unit: "g", grams: 80, calories: 90, macros: { cho: 3, ptn: 7, lip: 5 }, note: "Liso e cremoso", restriction: "disfagia" },
              { id: "s26-4", name: "Mousse de banana (banana + leite condensado batido)", quantity: 100, unit: "g", grams: 100, calories: 100, macros: { cho: 18, ptn: 3, lip: 2 }, note: "Consistência homogênea", restriction: "disfagia" }
            ]
          }
        ]
      },
      {
        id: "26-ref2",
        name: "Lanche da manhã",
        time: "10:00",
        calories: 180,
        observations: null,
        foods: [
          {
            id: "26-r2-f1",
            name: "Vitamina de fruta com leite (espessada se necessário)",
            quantity: 200, unit: "ml", grams: 250, calories: 150,
            macros: { cho: 22, ptn: 5, lip: 5 },
            substitutions: [
              { id: "s26-5", name: "Creme de frutas batido com iogurte", quantity: 200, unit: "ml", grams: 220, calories: 140, macros: { cho: 20, ptn: 5, lip: 4 }, note: "Sem pedaços", restriction: "disfagia" },
              { id: "s26-6", name: "Purê de mamão batido liso", quantity: 200, unit: "g", grams: 200, calories: 90, macros: { cho: 20, ptn: 1, lip: 0 }, note: "Naturalmente pastoso", restriction: "disfagia" }
            ]
          },
          {
            id: "26-r2-f2",
            name: "Cream cheese para enriquecer calorias",
            quantity: 1, unit: "colher de sopa", grams: 20, calories: 60,
            macros: { cho: 1, ptn: 1, lip: 6 },
            substitutions: [
              { id: "s26-7", name: "Requeijão cremoso", quantity: 1, unit: "colher de sopa", grams: 20, calories: 55, macros: { cho: 1, ptn: 2, lip: 5 }, note: null, restriction: null },
              { id: "s26-8", name: "Pasta de amendoim cremosa", quantity: 1, unit: "colher de chá", grams: 10, calories: 60, macros: { cho: 2, ptn: 2, lip: 5 }, note: "Consistência pastosa", restriction: "disfagia" }
            ]
          }
        ]
      },
      {
        id: "26-ref3",
        name: "Almoço",
        time: "12:00",
        calories: 400,
        observations: "Tudo processado até consistência homogênea. Evitar grãos inteiros soltos.",
        foods: [
          {
            id: "26-r3-f1",
            name: "Purê de batata cremoso com manteiga",
            quantity: 1, unit: "porção (150g)", grams: 150, calories: 150,
            macros: { cho: 25, ptn: 3, lip: 6 },
            substitutions: [
              { id: "s26-9", name: "Purê de mandioquinha com manteiga e leite", quantity: 1, unit: "porção (150g)", grams: 150, calories: 155, macros: { cho: 27, ptn: 3, lip: 5 }, note: "Textura mais suave", restriction: "disfagia" },
              { id: "s26-10", name: "Risoto cremoso de arroz com queijo", quantity: 1, unit: "porção (150g)", grams: 150, calories: 190, macros: { cho: 30, ptn: 6, lip: 6 }, note: "Arroz bem cozido e cremoso", restriction: "disfagia" }
            ]
          },
          {
            id: "26-r3-f2",
            name: "Mousse de frango (frango processado)",
            quantity: 1, unit: "porção (100g)", grams: 100, calories: 130,
            macros: { cho: 2, ptn: 20, lip: 5 },
            substitutions: [
              { id: "s26-11", name: "Ovo mexido bem macio", quantity: 2, unit: "unidades", grams: 100, calories: 155, macros: { cho: 0, ptn: 12, lip: 10 }, note: "Textura suave e homogênea", restriction: "disfagia" },
              { id: "s26-12", name: "Mousse de peixe branco (peixe processado)", quantity: 1, unit: "porção (100g)", grams: 100, calories: 100, macros: { cho: 0, ptn: 18, lip: 3 }, note: "Verificar espinhas antes de processar", restriction: "disfagia" }
            ]
          },
          {
            id: "26-r3-f3",
            name: "Creme de abóbora com azeite",
            quantity: 1, unit: "porção (100g)", grams: 100, calories: 70,
            macros: { cho: 10, ptn: 1, lip: 4 },
            substitutions: [
              { id: "s26-13", name: "Creme de cenoura batido", quantity: 1, unit: "porção (100g)", grams: 100, calories: 60, macros: { cho: 9, ptn: 1, lip: 3 }, note: null, restriction: null },
              { id: "s26-14", name: "Creme de beterraba com creme de leite", quantity: 1, unit: "porção (100g)", grams: 100, calories: 80, macros: { cho: 10, ptn: 1, lip: 4 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "26-ref4",
        name: "Lanche da tarde",
        time: "15:00",
        calories: 200,
        observations: null,
        foods: [
          {
            id: "26-r4-f1",
            name: "Pudim de leite (sem caramelo duro)",
            quantity: 1, unit: "fatia pequena (100g)", grams: 100, calories: 150,
            macros: { cho: 22, ptn: 5, lip: 5 },
            substitutions: [
              { id: "s26-15", name: "Mousse de maracujá cremosa", quantity: 1, unit: "porção (100g)", grams: 100, calories: 130, macros: { cho: 18, ptn: 4, lip: 4 }, note: "Textura leve e cremosa", restriction: "disfagia" },
              { id: "s26-16", name: "Gelatina proteica batida cremosa", quantity: 1, unit: "porção (120g)", grams: 120, calories: 80, macros: { cho: 10, ptn: 8, lip: 1 }, note: "Consistência firme porém suave", restriction: "disfagia" }
            ]
          },
          {
            id: "26-r4-f2",
            name: "Leite morno com cacau",
            quantity: 150, unit: "ml", grams: 150, calories: 100,
            macros: { cho: 12, ptn: 5, lip: 4 },
            substitutions: [
              { id: "s26-17", name: "Leite com achocolatado espessado", quantity: 150, unit: "ml", grams: 150, calories: 110, macros: { cho: 16, ptn: 5, lip: 3 }, note: null, restriction: null },
              { id: "s26-18", name: "Vitamina de abacate com leite e mel", quantity: 150, unit: "ml", grams: 180, calories: 160, macros: { cho: 16, ptn: 4, lip: 9 }, note: "Calórico e cremoso", restriction: "disfagia" }
            ]
          }
        ]
      },
      {
        id: "26-ref5",
        name: "Jantar",
        time: "18:30",
        calories: 350,
        observations: "Sopa grossa ou creme. Evitar sopas ralas.",
        foods: [
          {
            id: "26-r5-f1",
            name: "Sopa grossa de legumes com frango processado",
            quantity: 1, unit: "bowl (300ml)", grams: 350, calories: 280,
            macros: { cho: 30, ptn: 18, lip: 9 },
            substitutions: [
              { id: "s26-19", name: "Creme de batata com frango", quantity: 1, unit: "bowl (300ml)", grams: 350, calories: 290, macros: { cho: 32, ptn: 16, lip: 10 }, note: "Consistência grossa", restriction: "disfagia" },
              { id: "s26-20", name: "Caldo de feijão grosso batido com ovo processado", quantity: 1, unit: "bowl (300ml)", grams: 350, calories: 260, macros: { cho: 32, ptn: 16, lip: 7 }, note: "Bater no liquidificador", restriction: "disfagia" }
            ]
          },
          {
            id: "26-r5-f2",
            name: "Creme de queijo para enriquecimento",
            quantity: 1, unit: "colher de sopa", grams: 20, calories: 60,
            macros: { cho: 1, ptn: 3, lip: 5 },
            substitutions: [
              { id: "s26-21", name: "Requeijão cremoso", quantity: 1, unit: "colher de sopa", grams: 20, calories: 55, macros: { cho: 1, ptn: 2, lip: 5 }, note: null, restriction: null },
              { id: "s26-22", name: "Azeite extra virgem na sopa", quantity: 1, unit: "colher de sobremesa", grams: 8, calories: 71, macros: { cho: 0, ptn: 0, lip: 8 }, note: "Enriquecer calorias", restriction: null }
            ]
          }
        ]
      },
      {
        id: "26-ref6",
        name: "Ceia",
        time: "21:00",
        calories: 190,
        observations: "Refeição leve. Facilitar sono.",
        foods: [
          {
            id: "26-r6-f1",
            name: "Leite morno com mel (espessado se indicado)",
            quantity: 200, unit: "ml", grams: 200, calories: 160,
            macros: { cho: 18, ptn: 6, lip: 6 },
            substitutions: [
              { id: "s26-23", name: "Iogurte líquido cremoso", quantity: 200, unit: "ml", grams: 200, calories: 130, macros: { cho: 14, ptn: 6, lip: 4 }, note: null, restriction: null },
              { id: "s26-24", name: "Vitamina de banana quente com leite", quantity: 200, unit: "ml", grams: 220, calories: 175, macros: { cho: 26, ptn: 6, lip: 5 }, note: "Servir morno", restriction: null }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 27,
    slug: "idoso-ganho-muscular-2000",
    name: "3ª Idade Ganho Muscular 2000 kcal",
    objective: "idoso",
    totalCalories: 2000,
    macros: { protein: 150, carbs: 225, fat: 56 },
    mealsPerDay: 5,
    restrictions: [],
    tags: ["idoso", "sarcopenia", "ganho muscular", "proteína", "força"],
    badgeLabel: "Idoso Hipertrofia",
    badgeColor: "teal",
    clinicalNotes: "Indicado para idosos com sarcopenia ou risco de sarcopenia. Alta oferta proteica (1,2–1,5g/kg/dia). Distribuição proteica equalizada entre refeições para maximizar síntese proteica. Associar com programa de exercício resistido.",
    contraindications: "Monitorar função renal antes de prescrever alta proteína em idosos. Ajustar se TFG < 60 mL/min/1,73m². Atentar para hidratação adequada.",
    patientInstructions: "Consuma proteína em todas as refeições, especialmente após a atividade física. Beba pelo menos 1,5 a 2 litros de água por dia. Pratique exercícios de força 2 a 3 vezes por semana.",
    meals: [
      {
        id: "27-ref1",
        name: "Café da manhã",
        time: "07:00",
        calories: 420,
        observations: "Café da manhã proteico para iniciar síntese muscular.",
        foods: [
          {
            id: "27-r1-f1",
            name: "Omelete de 3 ovos com queijo e tomate",
            quantity: 1, unit: "omelete", grams: 200, calories: 280,
            macros: { cho: 4, ptn: 24, lip: 18 },
            substitutions: [
              { id: "s27-1", name: "Mexido de ovos com frango e legumes", quantity: 1, unit: "porção", grams: 200, calories: 290, macros: { cho: 5, ptn: 26, lip: 17 }, note: "Alta proteína", restriction: null },
              { id: "s27-2", name: "Iogurte grego com whey protein e fruta", quantity: 1, unit: "porção", grams: 250, calories: 270, macros: { cho: 18, ptn: 28, lip: 8 }, note: "Proteína de alto valor biológico", restriction: null }
            ]
          },
          {
            id: "27-r1-f2",
            name: "Pão integral com pasta de atum",
            quantity: 2, unit: "fatias", grams: 100, calories: 200,
            macros: { cho: 28, ptn: 16, lip: 5 },
            substitutions: [
              { id: "s27-3", name: "Tapioca com atum e cream cheese", quantity: 1, unit: "unidade média", grams: 120, calories: 210, macros: { cho: 28, ptn: 16, lip: 6 }, note: null, restriction: null },
              { id: "s27-4", name: "Torrada integral com ricota temperada", quantity: 3, unit: "fatias", grams: 90, calories: 190, macros: { cho: 24, ptn: 12, lip: 6 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "27-ref2",
        name: "Lanche da manhã / Pré-treino",
        time: "10:00",
        calories: 280,
        observations: "Oferecer 60–90 min antes do treino se exercício matutino.",
        foods: [
          {
            id: "27-r2-f1",
            name: "Banana com pasta de amendoim",
            quantity: 1, unit: "unidade + 1 colher de sopa", grams: 130, calories: 200,
            macros: { cho: 28, ptn: 5, lip: 8 },
            substitutions: [
              { id: "s27-5", name: "Batata-doce cozida com frango desfiado", quantity: 1, unit: "porção", grams: 150, calories: 195, macros: { cho: 28, ptn: 14, lip: 2 }, note: "Pré-treino sólido", restriction: null },
              { id: "s27-6", name: "Vitamina de banana com leite e aveia", quantity: 300, unit: "ml", grams: 350, calories: 210, macros: { cho: 32, ptn: 9, lip: 5 }, note: null, restriction: null }
            ]
          },
          {
            id: "27-r2-f2",
            name: "Iogurte grego sem açúcar",
            quantity: 1, unit: "pote (150g)", grams: 150, calories: 110,
            macros: { cho: 6, ptn: 15, lip: 4 },
            substitutions: [
              { id: "s27-7", name: "Queijo cottage", quantity: 1, unit: "xícara (120g)", grams: 120, calories: 100, macros: { cho: 4, ptn: 14, lip: 4 }, note: null, restriction: null },
              { id: "s27-8", name: "Shake de whey protein com leite desnatado", quantity: 1, unit: "dose (200ml)", grams: 230, calories: 180, macros: { cho: 12, ptn: 24, lip: 4 }, note: "Suplementação proteica", restriction: null }
            ]
          }
        ]
      },
      {
        id: "27-ref3",
        name: "Almoço",
        time: "13:00",
        calories: 600,
        observations: "Refeição principal. Proteína e carboidratos para recuperação muscular.",
        foods: [
          {
            id: "27-r3-f1",
            name: "Arroz integral",
            quantity: 4, unit: "colheres de servir", grams: 200, calories: 248,
            macros: { cho: 52, ptn: 5, lip: 2 },
            substitutions: [
              { id: "s27-9", name: "Macarrão integral", quantity: 1, unit: "prato raso", grams: 200, calories: 260, macros: { cho: 50, ptn: 8, lip: 2 }, note: null, restriction: null },
              { id: "s27-10", name: "Quinoa com arroz branco", quantity: 1, unit: "porção", grams: 200, calories: 240, macros: { cho: 44, ptn: 9, lip: 3 }, note: "Proteína adicional da quinoa", restriction: null }
            ]
          },
          {
            id: "27-r3-f2",
            name: "Carne bovina magra grelhada (patinho)",
            quantity: 1, unit: "filé grande (180g)", grams: 180, calories: 260,
            macros: { cho: 0, ptn: 40, lip: 10 },
            substitutions: [
              { id: "s27-11", name: "Salmão grelhado (180g)", quantity: 1, unit: "filé", grams: 180, calories: 340, macros: { cho: 0, ptn: 36, lip: 20 }, note: "Rico em ômega-3", restriction: null },
              { id: "s27-12", name: "Peito de frango grelhado com ovo cozido", quantity: 1, unit: "porção", grams: 200, calories: 260, macros: { cho: 0, ptn: 42, lip: 9 }, note: "Alta proteína de alto valor biológico", restriction: null }
            ]
          },
          {
            id: "27-r3-f3",
            name: "Feijão cozido",
            quantity: 2, unit: "conchas", grams: 120, calories: 110,
            macros: { cho: 18, ptn: 8, lip: 1 },
            substitutions: [
              { id: "s27-13", name: "Lentilha cozida", quantity: 2, unit: "conchas", grams: 120, calories: 115, macros: { cho: 18, ptn: 9, lip: 1 }, note: "Rica em ferro e proteína", restriction: null },
              { id: "s27-14", name: "Grão-de-bico cozido", quantity: 2, unit: "conchas", grams: 120, calories: 130, macros: { cho: 20, ptn: 7, lip: 2 }, note: null, restriction: null }
            ]
          },
          {
            id: "27-r3-f4",
            name: "Salada de folhas com azeite",
            quantity: 1, unit: "prato", grams: 100, calories: 60,
            macros: { cho: 5, ptn: 2, lip: 4 },
            substitutions: [
              { id: "s27-15", name: "Legumes cozidos no vapor com azeite", quantity: 1, unit: "porção", grams: 120, calories: 70, macros: { cho: 8, ptn: 3, lip: 4 }, note: null, restriction: null },
              { id: "s27-16", name: "Salada de beterraba com nozes e azeite", quantity: 1, unit: "porção", grams: 120, calories: 120, macros: { cho: 12, ptn: 3, lip: 7 }, note: "Anti-inflamatório", restriction: null }
            ]
          }
        ]
      },
      {
        id: "27-ref4",
        name: "Lanche da tarde / Pós-treino",
        time: "16:00",
        calories: 350,
        observations: "Janela anabólica: consumir proteína e carboidrato até 30–60 min após treino.",
        foods: [
          {
            id: "27-r4-f1",
            name: "Shake pós-treino: whey + leite + banana",
            quantity: 400, unit: "ml", grams: 450, calories: 280,
            macros: { cho: 32, ptn: 30, lip: 5 },
            substitutions: [
              { id: "s27-17", name: "Iogurte grego com granola e banana fatiada", quantity: 1, unit: "bowl", grams: 250, calories: 300, macros: { cho: 34, ptn: 22, lip: 8 }, note: null, restriction: null },
              { id: "s27-18", name: "Ovo cozido (2) com batata-doce cozida", quantity: 1, unit: "porção", grams: 200, calories: 260, macros: { cho: 28, ptn: 18, lip: 10 }, note: "Sem suplemento", restriction: null }
            ]
          },
          {
            id: "27-r4-f2",
            name: "Laranja",
            quantity: 1, unit: "unidade", grams: 130, calories: 62,
            macros: { cho: 15, ptn: 1, lip: 0 },
            substitutions: [
              { id: "s27-19", name: "Banana", quantity: 1, unit: "unidade", grams: 100, calories: 89, macros: { cho: 23, ptn: 1, lip: 0 }, note: "Carboidrato rápido pós-treino", restriction: null },
              { id: "s27-20", name: "Suco de frutas natural (200ml)", quantity: 200, unit: "ml", grams: 200, calories: 90, macros: { cho: 22, ptn: 1, lip: 0 }, note: null, restriction: null }
            ]
          }
        ]
      },
      {
        id: "27-ref5",
        name: "Jantar",
        time: "19:30",
        calories: 350,
        observations: "Jantar proteico. Carboidratos moderados à noite.",
        foods: [
          {
            id: "27-r5-f1",
            name: "Peixe assado com ervas (merluza ou tilápia)",
            quantity: 1, unit: "filé grande (180g)", grams: 180, calories: 180,
            macros: { cho: 0, ptn: 36, lip: 4 },
            substitutions: [
              { id: "s27-21", name: "Frango assado com legumes", quantity: 1, unit: "porção (180g)", grams: 180, calories: 220, macros: { cho: 5, ptn: 34, lip: 7 }, note: null, restriction: null },
              { id: "s27-22", name: "Omelete de claras (4 claras) com queijo", quantity: 1, unit: "omelete", grams: 160, calories: 190, macros: { cho: 2, ptn: 30, lip: 8 }, note: "Alta proteína, baixo carboidrato", restriction: null }
            ]
          },
          {
            id: "27-r5-f2",
            name: "Arroz com legumes refogados",
            quantity: 2, unit: "colheres + 1 concha", grams: 200, calories: 180,
            macros: { cho: 34, ptn: 6, lip: 4 },
            substitutions: [
              { id: "s27-23", name: "Quinoa com legumes salteados", quantity: 1, unit: "porção", grams: 200, calories: 200, macros: { cho: 30, ptn: 9, lip: 6 }, note: "Proteína adicional da quinoa", restriction: null },
              { id: "s27-24", name: "Batata-doce assada com salada verde", quantity: 1, unit: "porção", grams: 200, calories: 175, macros: { cho: 32, ptn: 4, lip: 4 }, note: null, restriction: null }
            ]
          }
        ]
      }
    ]
  }
];

export default MEAL_PLAN_TEMPLATES;
