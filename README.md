# SiteGuardian

![GitHub repo size](https://img.shields.io/github/repo-size/ahsan201/SiteGuardian-Acres-Project)
![GitHub contributors](https://img.shields.io/github/contributors/ahsan201/SiteGuardian-Acres-Project)
![GitHub forks](https://img.shields.io/github/forks/ahsan201/SiteGuardian-Acres-Project?style=social)
![Twitter Follow](https://img.shields.io/twitter/follow/ahsan_habib_1?style=social)

SiteGuardian is an advanced **monitoring and alert system** designed to protect and manage industrial sites, ensuring optimal safety and efficiency. It allows administrators and managers to assign devices, track activity, and respond to incidents in real time.

With features like role-based access control, device assignment, alarm history tracking, and a user-friendly interface, SiteGuardian is a comprehensive solution for industrial site management.

---

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of **Node.js** (v16 or higher) and **npm**.
- You have a **Firebase** project setup with Firestore, Authentication, and Storage enabled.
- You have access to a Windows, macOS, or Linux machine.
- You have read the [Firebase Documentation](https://firebase.google.com/docs).

---

## Installing SiteGuardian

To install SiteGuardian, follow these steps:

### Clone the Repository:

```bash
git clone https://github.com/ahsan201/SiteGuardian-Acres-Project.git
cd siteguardian
```

### Install Dependencies:

```bash
npm install
```

### Setup Firebase Configuration:

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Obtain your Firebase config object and replace the placeholder in `firebaseConfig.js`.

---

## Using SiteGuardian

To use SiteGuardian, follow these steps:

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to:

```
http://localhost:3000
```

3. Log in using your Firebase credentials.

4. Assign devices, monitor activity, and manage users through the dashboard.

### Example Commands:

#### Add a New Device:

```
POST /devices
Body: {
  "deviceID": "12345",
  "location": "Site A",
  "managerName": "John Doe"
}
```

---

## Contributing to SiteGuardian

To contribute to SiteGuardian, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`.
4. Push to the original branch: `git push origin <branch_name>`.
5. Create the pull request.

---

## Contributors

Thanks to the following people who have contributed to this project:

- [@ahsan201](https://github.com/ahsan201)
- [@kareenazaman](https://github.com/kareenazaman)
- [@wasifraiyan](https://github.com/wasifraiyan)

---

## Contact

If you want to contact us, you can reach out at:

- **Email**: niloy.ahsan02@gmail.com
- **Twitter**: [@ahsan_habib_1](https://x.com/ahsan_habib_1)

---

## License

This project uses the following license: [MIT License](https://choosealicense.com/licenses/mit/).
