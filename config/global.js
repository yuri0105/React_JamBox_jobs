// User Role
const role_producer = 0;
const role_musician = 1;
const role_admin = 2;
const role_superadmin = 3;

// JsonWebToken secret key
const jwtSecret = "secretkey";

//Send mail
const userMail = "olegbarsukovwork@gmail.com";
const password = "traktorA13579";
const service = "gmail";

module.exports = {
	role_producer,
	role_musician,
	role_admin,
	role_superadmin,
	jwtSecret,
	userMail,
	password,
	service,
}
