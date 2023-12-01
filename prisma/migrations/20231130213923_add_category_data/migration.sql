-- Create Categories.

INSERT INTO
    "public"."Category" ("name", "interest")
VALUES ('Informática', 5) RETURNING *;

INSERT INTO
    "public"."Category" ("name", "interest")
VALUES ('Automotivo', 2.5) RETURNING *;

INSERT INTO
    "public"."Category" ("name", "interest")
VALUES ('Móveis', 1) RETURNING *;