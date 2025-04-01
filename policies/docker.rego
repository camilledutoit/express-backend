package docker

deny[msg] {
  input.Config.User == ""
  msg = "Dockerfile must specify a non-root user."
}

deny[msg] {
  not some key
  key = "4000/tcp"
  key in input.Config.ExposedPorts
  msg = "Dockerfile must expose port 4000."
}

deny[msg] {
  input.Config.Healthcheck.Test == null
  msg = "Dockerfile must include a HEALTHCHECK instruction."
}