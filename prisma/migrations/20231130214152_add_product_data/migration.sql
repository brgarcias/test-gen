-- Create Products.

INSERT INTO
    "public"."Product" (
        "name",
        "description",
        "price",
        "categoryId"
    )
VALUES (
        'Notebook Dell Inspiron 15',
        'Desfrute de um desempenho ágil, porém silencioso, com processadores Intel® Core™.',
        4500,
        1
    ) RETURNING *;

INSERT INTO
    "public"."Product" (
        "name",
        "description",
        "price",
        "categoryId"
    )
VALUES (
        'Renault Sandero 2011',
        'Sandero é conhecido por oferecer um espaço interno generoso e bom custo-benefício.',
        25000,
        2
    ) RETURNING *;

INSERT INTO
    "public"."Product" (
        "name",
        "description",
        "price",
        "categoryId"
    )
VALUES (
        'Sofá Retrátil e Reclinável',
        'Um modelo com design moderno e sofisticado.',
        1300,
        3
) RETURNING *;