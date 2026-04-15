{
  description = "Hell yeah, it's my desktop shell.";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    naersk = {
      url = "github:nix-community/naersk";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs:
    inputs.flake-parts.lib.mkFlake {inherit inputs;} {
      systems = [
        "x86_64-linux"
      ];
      perSystem = {pkgs, ...}: let
        naersk = pkgs.callPackage inputs.naersk {};
        buildInputs = with pkgs; [
          gtk4
          gtk4-layer-shell
          jetbrains-mono
        ];
        nativeBuildInputs = with pkgs; [
          pkg-config
        ];
      in {
        formatter = pkgs.alejandra;

        packages = rec {
          default = shell-yeah;
          shell-yeah = naersk.buildPackage {
            inherit buildInputs nativeBuildInputs;
            src = ./.;
          };
        };

        devShells.default = pkgs.mkShell {
          inherit buildInputs;
          nativeBuildInputs = with pkgs;
            nativeBuildInputs
            ++ [
              bacon
              cargo
              clippy
              rustc
              rustfmt
              rust-analyzer
            ];
          RUST_SRC_PATH = "${pkgs.rustPlatform.rustLibSrc}";
        };
      };
    };
}
