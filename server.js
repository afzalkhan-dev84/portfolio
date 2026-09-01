const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true }));


// =====================================================
// SERVE PORTFOLIO FILES
// =====================================================

app.use(express.static(__dirname));


// =====================================================
// CONTACT DATA STORAGE
// =====================================================

// Folder where contact submissions will be saved

const dataDirectory = path.join(__dirname, "data");


// Create data folder if it does not exist

if (!fs.existsSync(dataDirectory)) {

    fs.mkdirSync(dataDirectory, {
        recursive: true
    });

}


// Contact file

const contactsFile = path.join(
    dataDirectory,
    "contacts.json"
);


// Create contacts.json if it does not exist

if (!fs.existsSync(contactsFile)) {

    fs.writeFileSync(
        contactsFile,
        JSON.stringify([], null, 2),
        "utf8"
    );

}


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "index.html")
    );

});


// =====================================================
// CONTACT FORM
// =====================================================

app.post("/api/contact", async (req, res) => {

    try {

        const {
            name,
            email,
            subject,
            message
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !name ||
            !email ||
            !subject ||
            !message
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill in all fields."

            });

        }


        // Remove unnecessary spaces

        const cleanName = String(name).trim();

        const cleanEmail = String(email).trim();

        const cleanSubject = String(subject).trim();

        const cleanMessage = String(message).trim();


        if (
            !cleanName ||
            !cleanEmail ||
            !cleanSubject ||
            !cleanMessage
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please fill in all fields."

            });

        }


        // =================================================
        // CREATE CONTACT RECORD
        // =================================================

        let contacts = [];


        try {

            const fileData = fs.readFileSync(
                contactsFile,
                "utf8"
            );


            contacts = JSON.parse(fileData);


            if (!Array.isArray(contacts)) {

                contacts = [];

            }

        } catch (error) {

            console.error(
                "CONTACT FILE READ ERROR:",
                error
            );

            contacts = [];

        }


        // Generate new ID

        const newId =
            contacts.length > 0
                ? Math.max(
                    ...contacts.map(
                        contact =>
                            Number(contact.id) || 0
                    )
                ) + 1
                : 1;


        // Current date and time

        const submittedAt =
            new Date().toISOString();


        // New contact object

        const newContact = {

            id: newId,

            name: cleanName,

            email: cleanEmail,

            subject: cleanSubject,

            message: cleanMessage,

            submittedAt: submittedAt

        };


        // Add new contact

        contacts.push(newContact);


        // Save contact

        fs.writeFileSync(

            contactsFile,

            JSON.stringify(
                contacts,
                null,
                2
            ),

            "utf8"

        );


        console.log(
            "================================="
        );

        console.log(
            "NEW PORTFOLIO CONTACT"
        );

        console.log(
            "ID:",
            newContact.id
        );

        console.log(
            "Name:",
            newContact.name
        );

        console.log(
            "Email:",
            newContact.email
        );

        console.log(
            "Subject:",
            newContact.subject
        );

        console.log(
            "Saved successfully."
        );

        console.log(
            "================================="
        );


        // =================================================
        // EMAIL TRANSPORTER
        // =================================================

        const transporter =
            nodemailer.createTransport({

                service: "gmail",

                auth: {

                    user:
                        process.env.EMAIL_USER,

                    pass:
                        process.env.EMAIL_APP_PASSWORD

                }

            });


        // =================================================
        // EMAIL TO YOU
        // =================================================

        const mailOptions = {

            from:
                process.env.EMAIL_USER,

            to:
                process.env.EMAIL_USER,

            replyTo:
                cleanEmail,

            subject:
                `Portfolio Contact: ${cleanSubject}`,

            html: `

                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 700px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    background: #ffffff;
                ">

                    <h2 style="
                        color: #111;
                        margin-top: 0;
                    ">

                        New Portfolio Contact

                    </h2>


                    <p>

                        Someone has contacted you
                        through your professional
                        portfolio website.

                    </p>


                    <hr>


                    <p>

                        <strong>
                            Contact ID:
                        </strong>

                        ${newContact.id}

                    </p>


                    <p>

                        <strong>
                            Name:
                        </strong>

                        ${escapeHtml(cleanName)}

                    </p>


                    <p>

                        <strong>
                            Email:
                        </strong>

                        ${escapeHtml(cleanEmail)}

                    </p>


                    <p>

                        <strong>
                            Subject:
                        </strong>

                        ${escapeHtml(cleanSubject)}

                    </p>


                    <p>

                        <strong>
                            Date/Time:
                        </strong>

                        ${escapeHtml(submittedAt)}

                    </p>


                    <p>

                        <strong>
                            Message:
                        </strong>

                    </p>


                    <div style="
                        background: #f5f5f5;
                        padding: 18px;
                        border-radius: 8px;
                        white-space: pre-wrap;
                        line-height: 1.6;
                    ">

                        ${escapeHtml(cleanMessage)}

                    </div>


                    <hr>


                    <p style="
                        color: #777;
                        font-size: 13px;
                    ">

                        This message was sent from
                        Afzal Khan's professional portfolio.

                    </p>


                </div>

            `

        };


        // =================================================
        // SEND EMAIL
        // =================================================

        await transporter.sendMail(
            mailOptions
        );


        // =================================================
        // SUCCESS
        // =================================================

        res.json({

            success: true,

            message:
                "Thank you! Your message has been sent successfully."

        });


    } catch (error) {

        console.error(
            "CONTACT ERROR:",
            error
        );


        // Important:
        // The contact may already have been saved
        // before the email failed.

        res.status(500).json({

            success: false,

            message:
                "Your message could not be processed right now. Please try WhatsApp or email directly."

        });

    }

});


// =====================================================
// OPTIONAL: VIEW SAVED CONTACTS
// =====================================================

// We will secure this properly later.
// For now this endpoint is only useful during development.

app.get("/api/contacts", (req, res) => {

    try {

        const fileData =
            fs.readFileSync(
                contactsFile,
                "utf8"
            );


        const contacts =
            JSON.parse(fileData);


        res.json({

            success: true,

            count: contacts.length,

            contacts: contacts

        });


    } catch (error) {

        console.error(
            "CONTACTS READ ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Unable to read saved contacts."

        });

    }

});


// =====================================================
// BASIC HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// =====================================================
// SERVER
// =====================================================

app.listen(PORT, () => {

    console.log(
        "================================="
    );

    console.log(
        "AFZAL KHAN PORTFOLIO"
    );

    console.log(
        "================================="
    );

    console.log(
        "Server running at:"
    );

    console.log(
        `http://localhost:${PORT}`
    );

    console.log(
        "================================="
    );

});