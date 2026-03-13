import imaplib
import email
import os

email_pass = os.environ.get("DATA_EMAIL_PASS")
email_addr = os.environ.get("DATA_EMAIL_ADDR")

imap_server = "imap.mail.ru"
mail = imaplib.IMAP4_SSL(imap_server)
mail.login(email_addr, email_pass)
mail.select("Inbox")


# Optimization: Use the 'SEEN' flag to only retrieve unread emails
typ, data = mail.search(None, "SEEN")
mail_ids = data[0].split()

if mail_ids:
    # Optimization: Use the most recent email instead of the 4th most recent email
    last_id = mail_ids[-1]
    typ, data = mail.fetch(last_id, "(RFC822)")
    raw_email = data[0][1].decode("utf-8")
    email_message = email.message_from_string(raw_email)

    for part in email_message.walk():
        if part.get_content_maintype() == "multipart":
            continue
        if part.get("Content-Disposition") is None:
            continue

        file_name = part.get_filename()
        if file_name:
            file_path = os.path.join("/datapipline/services/email", file_name)

            if not os.path.isfile(file_path):
                with open(file_path, "wb") as fp:
                    # Optimization: Use a with statement to automatically close the file after writing
                    fp.write(part.get_payload(decode=True))

            subject = email_message["Subject"]
            print(f'Downloaded "{file_name}" from email titled "{subject}"')
else:
    print("No new emails found.")


# email_pass = "RTt1ww1rTCdgL0Npge3H"
# email_addr = "telemetry@nordal.kz"
# import imaplib
# import email
# import os
# import base64


# imap_server = "imap.mail.ru"
# mail = imaplib.IMAP4_SSL(imap_server)
# mail.login(email_addr, email_pass)
# mail.select("Inbox")
# type, data = mail.search(None, "ALL")
# mail_ids = data[0]
# id_list = mail_ids.split()

# for i in id_list:
#     typ, data = mail.fetch(i, "(RFC822)")
#     raw_email = data[0][1]
#     raw_email_string = raw_email.decode("utf-8")
#     email_message = email.message_from_string(raw_email_string)

#     for part in email_message.walk():
#         if part.get_content_maintype() == "multipart":
#             continue
#         if part.get("Content-Disposition") is None:
#             continue
#         fileName = part.get_filename()
#         if bool(fileName):
#             time = email_message["Date"]
#             time = time.replace(":", "-").replace(" ", "_")
#             fileName = f"{time}_{fileName}"
#             filePath = os.path.join("/django/backend/services/email", fileName)
#             if not os.path.isfile(filePath):
#                 fp = open(filePath, "wb")
#                 fp.write(part.get_payload(decode=True))
#                 fp.close()
#             subject = str(email_message).split("Subject: ", 1)[1].split("\nTo:", 1)[0]
#             print(
#                 'Downloaded "{file}" from email titled "{subject}"'.format(
#                     file=fileName, subject=subject
#                 )
#             )
