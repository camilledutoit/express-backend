package docker

deny[msg] {
  input.Config.User == ""
  msg = "Dockerfile must specify a non-root user."
}

# Ensure port 4000 is exposed
deny[msg] {
  not "4000/tcp" in input.Config.ExposedPorts
  msg = "Dockerfile must expose port 4000."
}

deny[msg] {
  input.Config.Healthcheck.Test == null
  msg = "Dockerfile must include a HEALTHCHECK instruction."
}