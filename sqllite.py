import sqlite3


def value_exist(column_name, value):
    connect = sqlite3.connect("UserDB.db")
    cursor = connect.cursor()
    
    # Use parameterized query for security
    count_query = f"SELECT count(*) FROM users WHERE {column_name} =?"
    cursor.execute(count_query, (value,))

    # Get the count result
    result = cursor.fetchone()[0]

    if (result):
        row_values = f"SELECT * FROM users"
        cursor.execute(row_values)

        result2 = cursor.fetchall()[0]

        connect.close()

        return print(result, result2)

column_name = "email"
value = "a@aol.com"

email_exists = value_exist(column_name, value)


