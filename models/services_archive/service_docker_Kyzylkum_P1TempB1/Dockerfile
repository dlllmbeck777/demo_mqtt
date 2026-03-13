FROM debian:10.9-slim


##################################################
#     Install Anaconda 3:
##################################################

RUN apt-get update && apt-get install -y \
    curl \
    bzip2 \
    python3-pip \
&&	curl -o miniconda_install.sh https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
&&	bash miniconda_install.sh -b -p ~/anaconda3 \
&& 	echo 'export PATH="~/anaconda3/bin:$PATH"' >> ~/.bashrc \
&&	~/anaconda3/bin/conda update -n base conda \
&& 	rm miniconda_install.sh \
&&	rm -rf /var/lib/apt/lists/* \
&&	/bin/bash -c "source ~/.bashrc"

ENV PATH="~/anaconda3/bin:${PATH}"


##################################################
#    Setup env for current project:
##################################################

EXPOSE 1477 1478

RUN /bin/bash -c "conda create -y -n PYMODEL3.12.7 python=3.12.7"
 
ADD requirements.txt /tmp/setup/requirements.txt

RUN /bin/bash -c "source activate PYMODEL3.12.7 && pip3 install -r /tmp/setup/requirements.txt"

WORKDIR /Service

ADD Service /Service

# ✅ Grant execute permissions to run.sh
RUN chmod +x /Service/run.sh

ENTRYPOINT ["/bin/bash", "-c", "source activate PYMODEL3.12.7 && ./run.sh"]
