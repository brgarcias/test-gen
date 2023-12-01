-- Create Users

INSERT INTO
    "public"."User" (
        "username",
        "fullName",
        "email",
        "password",
        "role"
    )
VALUES (
        'brgarcias',
        'Bruno Garcia',
        'bruno-151299@hotmail.com',
        '$2a$12$M1lbrmDL5RbZ/YGUDt0lJejkzsZB9lk.09a0KfLr94xx6bcmTaCw6',
        'DEV'
    ) RETURNING *;

INSERT INTO
    "public"."User" (
        "username",
        "fullName",
        "email",
        "password",
        "role"
    )
VALUES (
        'aroque',
        'Amanda Roque',
        'arraroque@hotmail.com',
        '$2a$12$FzBsNu3JQLpbPxuhdq/FwetSBimA1spWevKJ3A0WdZRzh6Fv7YoEa',
        'ADMIN'
    ) RETURNING *;

INSERT INTO
    "public"."User" (
        "username",
        "fullName",
        "email",
        "password",
        "role"
    )
VALUES (
        'drigarcia',
        'Adriana Garcia',
        'drigarcia@hotmail.com',
        '$2a$12$aF3MbtlM6ubQDkVDj0yP.Ot6ZqrGhZB/N1se0zoRHc7CrBCuy2ROa',
        'USER'
    ) RETURNING *;