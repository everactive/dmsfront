terraform {
  required_providers {
    kubectl = {
      source = "gavinbunney/kubectl"
    }
  }
}

locals {
  namespace = var.namespace
  image     = var.image
}

resource "kubernetes_deployment" "dmsfront" {
  metadata {
    name      = "dmsfront"
    namespace = local.namespace
  }
  spec {
    selector {
      match_labels = {
        app = "dmsfront"
      }
    }
    template {
      metadata {
        labels = {
          app = "dmsfront"
        }
      }
      spec {
        container {
          name  = "dmsfront"
          image = local.image
          port {
            container_port = 80
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "dmsfront-internal" {
  metadata {
    name      = "dmsfront-internal"
    namespace = local.namespace
  }
  spec {
    selector = {
      app = "dmsfront"
    }
    port {
      port     = "80"
      protocol = "TCP"
    }
  }
}

